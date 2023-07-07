"use client"
import {atom} from "jotai"
import { useHydrateAtoms } from "jotai/utils"
import { Session } from "next-auth"

export const sessionAtom = atom<Session | null>(null)

export const SessionComponent = ({children, session}: {children?: React.ReactNode, session: Session | null}) => {
  useHydrateAtoms([[sessionAtom, session]])

  return (
    <>
      {children}
    </>
  );
}