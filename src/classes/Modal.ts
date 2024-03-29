import { IProject } from "./Project"
import { Project } from "./Project"

//Toggle stänger ner när form är submittad

export function toggleModal (id:string) {
  const modal = document.getElementById(id)
  if(modal && modal instanceof HTMLDialogElement) {
    modal.close()
  } else {
    console.warn("no modal warn")
  }
}


export function showModal(id:string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) { // om modalen finns och är av typen HTMLDialogElement
        modal.showModal()
    } else {
        console.warn("No modal found:", id)
    }
}

export function closeModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
      modal.close()
    } else {
      console.warn("The provided modal wasn't found. ID: ", id)
    }
  }