import { NextRequest, NextResponse } from 'next/server';

// Mock user database (in-memory for demo; replace with real DB in production)
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'dealer1', password: 'dealer123', role: 'dealer' },
  { id: 3, username: 'sales1', password: 'sales123', role: 'salesperson' },
];

// Simple JWT-like token generation (use a library like jsonwebtoken in production)
function generateToken(user: any) {
  return btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 3600000 })); // 1 hour expiry
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken(user);

    return NextResponse.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
      message: 'Login successful'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Auth endpoint - Use POST to login' });
}