import * as React from 'react'
import { motion } from 'framer-motion'

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
  type: 'fade',
  ease: 'linear',
  duration: 0.3,
}

type AnimationProps = {
  children: React.ReactNode
}

export const FadeIn = ({ children }: AnimationProps) => (
  <motion.div variants={variants} initial="initial" animate="in" exit="exit" transition={transition}>
    {children}
  </motion.div>
)
