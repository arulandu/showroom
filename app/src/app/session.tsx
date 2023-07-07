"use client"
import { Employee } from "@prisma/client"
import {atom} from "jotai"
import { useHydrateAtoms } from "jotai/utils"

export type Session = {
  user: Employee
}

export const sessionAtom = atom<Session | null>(null)

export const SessionComponent = ({children, session}: {children?: React.ReactNode, session: Session | null}) => {
  useHydrateAtoms([[sessionAtom, session]])

  return (
    <>
      {children}
    </>
  );
}