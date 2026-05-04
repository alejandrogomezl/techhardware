import { Product } from '@/models/Product'
import { Types } from 'mongoose'
import Link from 'next/link'

interface ProductTileProps {
  product: Product & { _id: Types.ObjectId }
}

export default function ProductTile({ product }: ProductTileProps) {
  return (
    <Link href={`/products/${product._id}`} className='group'>
      <div className='w-full h-48 overflow-hidden rounded-lg flex items-center justify-center'>
        <img
          src={product.img}
          alt={product.name}
          className='h-full w-full object-contain group-hover:opacity-75'
        />
      </div>
      <h3 className='mt-4 text-sm text-gray-900'>{product.name}</h3>
      <p className='mt-1 text-lg font-medium text-gray-900'>
        {product.price.toFixed(2) + ' €'}
      </p>
    </Link>
  )
}
