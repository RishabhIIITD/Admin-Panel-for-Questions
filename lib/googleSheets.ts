import { google } from 'googleapis';
import type { MCQPayload, MCQRecord } from '@/lib/mcq';

// Environment variables
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getGoogleSheetsClient() {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY || !SHEET_ID) {
    throw new Error('Missing Google Sheets credentials');
  }

  const auth = new google.auth.JWT(
    SERVICE_ACCOUNT_EMAIL,
    undefined,
    PRIVATE_KEY,
    SCOPES
  );

  return google.sheets({ version: 'v4', auth });
}

export const HEADERS = [
  'id', 'subject', 'topic', 'subtopic', 'type', 'question',
  'optionA', 'optionB', 'optionC', 'optionD', 'correctOption', 'explanation', 'difficulty'
] as const;

type HeaderKey = (typeof HEADERS)[number];

function getSheetRange(title: string, cells: string) {
  const escapedTitle = title.replace(/'/g, "''");
  return `'${escapedTitle}'!${cells}`;
}

// Cache sheet details to avoid fetching metadata on every request
let cachedSheetTitle: string | null = null;
let cachedSheetId: number | null = null;

async function getSheetDetails() {
  if (cachedSheetTitle && cachedSheetId !== null) {
    return { title: cachedSheetTitle, sheetId: cachedSheetId };
  }

  const sheets = await getGoogleSheetsClient();
  const response = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  // Use the first sheet found in the spreadsheet
  const sheet = response.data.sheets?.[0];
  if (!sheet || !sheet.properties) {
    throw new Error('No sheets found in the spreadsheet');
  }

  cachedSheetTitle = sheet.properties.title || 'Sheet1';
  cachedSheetId = sheet.properties.sheetId ?? 0;

  return { title: cachedSheetTitle, sheetId: cachedSheetId };
}

export async function getMCQs(): Promise<MCQRecord[]> {
  const sheets = await getGoogleSheetsClient();
  const { title } = await getSheetDetails();
  
  const range = getSheetRange(title, 'A2:M');
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: range,
  });

  const rows = response.data.values || [];
  return rows.map((row) => {
    const mcq = {} as Record<HeaderKey, string>;
    HEADERS.forEach((header, index) => {
      mcq[header] = row[index] || '';
    });

    return mcq as MCQRecord;
  });
}

export async function addMCQ(mcqData: MCQRecord) {
  const sheets = await getGoogleSheetsClient();
  const { title } = await getSheetDetails();
  
  const newRow = HEADERS.map(header => mcqData[header] || '');
  const range = getSheetRange(title, 'A2:M');
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [newRow],
    },
  });
}

async function findRowNumberById(id: string) {
  const sheets = await getGoogleSheetsClient();
  const { title } = await getSheetDetails();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: getSheetRange(title, 'A2:A'),
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  if (rowIndex === -1) {
    throw new Error('MCQ not found');
  }

  return rowIndex + 2;
}

async function verifyIdAtRow(rowNumber: number, id: string) {
  const sheets = await getGoogleSheetsClient();
  const { title } = await getSheetDetails();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: getSheetRange(title, `A${rowNumber}:A${rowNumber}`),
  });

  return (response.data.values?.[0]?.[0] || '') === id;
}

async function resolveStableRowNumberById(id: string) {
  const initialRow = await findRowNumberById(id);
  if (await verifyIdAtRow(initialRow, id)) {
    return initialRow;
  }

  const retryRow = await findRowNumberById(id);
  if (await verifyIdAtRow(retryRow, id)) {
    return retryRow;
  }

  throw new Error('Row changed during operation. Please retry.');
}

export async function updateMCQ(id: string, mcqData: MCQPayload) {
  const sheets = await getGoogleSheetsClient();
  const { title } = await getSheetDetails();

  const rowNumber = await resolveStableRowNumberById(id);
  const updatedMCQ: MCQRecord = { ...mcqData, id };
  const newRow = HEADERS.map((header) => updatedMCQ[header] || '');
  const range = getSheetRange(title, `A${rowNumber}:M${rowNumber}`);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [newRow],
    },
  });
}

export async function deleteMCQ(id: string) {
  const sheets = await getGoogleSheetsClient();
  const { sheetId } = await getSheetDetails();

  const rowNumber = await resolveStableRowNumberById(id);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });
}
