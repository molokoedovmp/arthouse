'use client'

import { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Lang } from '../lib/i18n'

const LangContext = createContext<{
  lang: Lang
  setLang: (lang: Lang) => void
}>({ lang: 'ru', setLang: () => {} })

export function LangProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode
  initialLang: Lang
}) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const router = useRouter()

  function setLang(newLang: Lang) {
    document.cookie = `lang=${newLang};path=/;max-age=31536000`
    setLangState(newLang)
    router.refresh()
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LangContext)
}
