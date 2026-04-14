import { NextRequest, NextResponse } from 'next/server';
import { getProducts, GetProductsResponse } from '@/lib/handlers';

export async function GET(
  _request: NextRequest
): Promise<NextResponse<GetProductsResponse>> {
  const res = await getProducts();
  return NextResponse.json(res);
}
