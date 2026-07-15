'use client'
import { useState, useEffect } from 'react'
import { useFlowerCollection } from 'app/context/FlowerCollectionContext'
import { BouquetButton } from './BouquetButton'
import { BouquetPanel } from './BouquetPanel'

export function BouquetController() {
  const [isOpen, setIsOpen] = useState(false)
  const { justCompleted, clearComplete } = useFlowerCollection()

  // Auto-open panel when the last flower is collected
  useEffect(() => {
    if (justCompleted) {
      setIsOpen(true)
      clearComplete()
    }
  }, [justCompleted, clearComplete])

  return (
    <>
      <BouquetButton onOpen={() => setIsOpen(true)} />
      <BouquetPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
