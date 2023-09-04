export interface Contact {
  address: string
  name: string
}

/* --- STATE --- */
export interface ContactsState {
  [key: string]: Contact
}
