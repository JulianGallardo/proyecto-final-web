import * as React from "react"

export function useCustomDialog() {
  const [isOpen, setIsOpen] = React.useState<boolean >(false)

  return {
    isOpen,
    setIsOpen,
  }

}
