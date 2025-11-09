"use client"

import IconButton from '../../ui/button/IconButton'
import { 
  FiPlus, 
  FiShoppingCart, 
  FiUser,
  FiMenu
} from 'react-icons/fi'
import { BiMoviePlay, BiStore } from 'react-icons/bi'
import { MdChatBubbleOutline } from 'react-icons/md'
import Logo from '../../common/logo/Logo'
import TopAds from '@/components/common/ads/TopAds'
import Link from 'next/link'
import { HOME, CART, USER } from '@/lib/routes'
import Button from '@/components/ui/button/Button'
import SearchBox from '@/components/common/SearchBox'
import { useContext, useState } from 'react'
import { FloatingMenuContext } from '@/components/common/FloatingMenu/FloatingMenuProvider'
import FloorsModal from '@/components/common/FloorsModal'
import { IoLayersOutline } from 'react-icons/io5'

export default function Header() {
  const { toggleMenu } = useContext(FloatingMenuContext);
  const [showFloorsModal, setShowFloorsModal] = useState(false);
  
  return (
    <header className="hidden lg:block border-b border-primary-500">
      <div className="container mx-auto ">
      <TopAds />
      </div>

      <div className="container mx-auto px-4 py-2 h-[60px]">
        <div className="flex justify-between items-center h-full">
          {/* Logo and Language Section */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <IconButton 
                onClick={toggleMenu}
                className="text-white p-2 hover:bg-primary-600 rounded-md transition-colors"
                variant='outline-secondary'
              >
                <FiMenu className="w-6 h-6" />
              </IconButton>
              <Link href={HOME}>
                <Logo />
              </Link>
            </div>
    
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-8 w-full">
            <SearchBox />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <IconButton 
              type="link" 
              href={USER.REGISTER} 
              variant="outline-secondary" 
              tooltip="ثبت فروشگاه"
              className='block text-white'
              
            >
              <FiPlus className="w-6 h-6" />
            </IconButton>

            <IconButton 
              onClick={() => setShowFloorsModal(true)}
              variant="outline-secondary" 
              tooltip="طبقات مجتمع"
              className='block text-white'
            >
              <IoLayersOutline className="w-6 h-6" />
            </IconButton>

            <IconButton 
              type="link" 
              href={CART} 
              variant="outline-secondary" 
              tooltip="سبد خرید"
              className='block text-white'
            >
              <FiShoppingCart className="w-6 h-6" />
            </IconButton>

            <IconButton
              type="link" 
              href="/explore" 
              variant="outline-secondary" 
              tooltip="اکسپلور"
              className='block text-white'
            >
              <BiMoviePlay className="w-6 h-6" />
            </IconButton>

            <IconButton
              type="link" 
              href="/messages" 
              variant="outline-secondary"
              tooltip="گفتگو و اعلانات"
              className='block text-white'
            >
              <MdChatBubbleOutline className="w-6 h-6" />
            </IconButton>

        
         
            <div className="h-8 w-[1px] bg-primary-300 mx-2"></div>

            <Button 
              type="link" 
              href={USER.LOGIN} 
              variant='outline-secondary'
              className="flex items-center gap-2"
              size='md'
            >
              <FiUser className="w-6 h-6" />
              <span className="text-white font-bold">ورود / ثبت‌نام</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Modal for floors */}
      <FloorsModal 
        isOpen={showFloorsModal} 
        onClose={() => setShowFloorsModal(false)} 
      />
    </header>
  )
}