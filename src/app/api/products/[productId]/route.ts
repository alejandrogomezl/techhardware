import { NextRequest, NextResponse } from 'next/server';
import { getProduct, GetProductResponse } from '@/lib/handlers';
import { Types } from 'mongoose';

export async function GET(
  _request: NextRequest,
  { params }: { params: { productId: string } }
): Promise<NextResponse<GetProductResponse | { error: string }>> {
  if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
  }

  try {
    const product = await getProduct(params.productId);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
