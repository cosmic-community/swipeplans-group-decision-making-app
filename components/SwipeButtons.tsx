import { X, Heart } from 'lucide-react'

interface SwipeButtonsProps {
  onPass: () => void
  onLike: () => void
}

export default function SwipeButtons({ onPass, onLike }: SwipeButtonsProps) {
  return (
    <div className="flex justify-center items-center gap-8">
      <button
        onClick={onPass}
        className="swipe-action-button swipe-action-pass"
        aria-label="Pass - Swipe Left"
      >
        <X className="w-6 h-6" />
      </button>
      
      <button
        onClick={onLike}
        className="swipe-action-button swipe-action-like"
        aria-label="Like - Swipe Right"
      >
        <Heart className="w-6 h-6" />
      </button>
    </div>
  )
}