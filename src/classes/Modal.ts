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


export function showModal(id:string ) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) { // om modalen finns och är av typen HTMLDialogElement
        modal.showModal()
    } else {
        console.warn("No modal found:", id)
    }
}


/*

export function showModal(id: string, projectId: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
      modal.showModal()  
    const editForm = document.getElementById("edit-project-form") as HTMLFormElement;
      if (editForm) {
          editForm.dataset.projectId = projectId; // Set the projectId data attribute on the form
      }
  }
}
*/

export function closeModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
      modal.close()
    } else {
      console.warn("The provided modal wasn't found. ID: ", id)
    }
  }