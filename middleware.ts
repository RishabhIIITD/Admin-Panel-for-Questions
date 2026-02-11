import { NextRequest, NextResponse } from 'next/server';

function unauthorizedResponse() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="MCQ Admin Panel"' },
  });
}

export function middleware(request: NextRequest) {
  const username = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (!username || !password) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) {
    return unauthorizedResponse();
  }

  const encodedCredentials = authHeader.split(' ')[1];
  if (!encodedCredentials) {
    return unauthorizedResponse();
  }

  let decodedCredentials: string;
  try {
    decodedCredentials = atob(encodedCredentials);
  } catch {
    return unauthorizedResponse();
  }

  const separatorIndex = decodedCredentials.indexOf(':');
  if (separatorIndex === -1) {
    return unauthorizedResponse();
  }

  const providedUser = decodedCredentials.slice(0, separatorIndex);
  const providedPass = decodedCredentials.slice(separatorIndex + 1);

  if (providedUser !== username || providedPass !== password) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
