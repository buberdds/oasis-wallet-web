const actual = jest.requireActual('framer-motion')
module.exports = {
  ...actual,
  /* eslint-disable-next-line react/prop-types */
  AnimatePresence: ({ children }) => <div className="mocked-framer-motion-AnimatePresence">{children}</div>,
  motion: {
    ...actual.motion,
    div: ({ children }) => <div className="mocked-framer-motion-div">{children}</div>,
  },
}
