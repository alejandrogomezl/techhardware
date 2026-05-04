import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/handlers'
import AddToCartButton from '@/components/AddToCartButton'

export default async function ProductPage({
  params,
}: {
  params: { productId: string }
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound()
  }

  const product = await getProduct(params.productId)
  if (!product) {
    notFound()
  }

  return (
    <div className='flex flex-col'>
      <div className='lg:grid lg:grid-cols-2 lg:gap-x-12'>
        <div className='overflow-hidden rounded-lg bg-gray-100'>
          <img
            src={product.img}
            alt={product.name}
            className='h-full w-full object-cover object-center'
          />
        </div>

        <div className='mt-8 lg:mt-0'>
          <h1 className='text-3xl font-bold text-gray-900'>{product.name}</h1>
          <p className='mt-4 text-2xl font-semibold text-indigo-600'>
            {product.price.toFixed(2)} €
          </p>

          {product.description && (
            <p className='mt-6 text-base text-gray-600'>{product.description}</p>
          )}

          <AddToCartButton
            productId={params.productId}
            name={product.name}
            price={product.price}
            img={product.img}
          />
        </div>
      </div>
    </div>
  )
}
