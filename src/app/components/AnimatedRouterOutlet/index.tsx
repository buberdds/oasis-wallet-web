import { motion } from 'framer-motion'
import { useLocation, Outlet } from 'react-router-dom'

const variants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
}

const transition = {
  type: 'tween',
  ease: 'linear',
  duration: 0.3,
}

export const AnimatedRouterOutlet = () => {
  const { pathname } = useLocation()

  return (
    <motion.div key={pathname} initial="initial" animate="in" variants={variants} transition={transition}>
      <Outlet />
    </motion.div>
  )
}
