import { IProject, role, status } from "./classes/Project"
import { ProjectManager } from "./classes/ProjectManager"


function showModal(id:string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) { // om modalen finns och är av typen HTMLDialogElement
        modal.showModal()
    } else {
        console.warn("No modal found:", id)
    }
}
function closeModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
      modal.close()
    } else {
      console.warn("The provided modal wasn't found. ID: ", id)
    }
  }

//Toggle stänger ner när form är submittad
function toggleModal(id:string) {
    const modal = document.getElementById(id)   
    if (modal && modal instanceof HTMLDialogElement) { // om modalen finns och är av typen HTMLDialogElement
        modal.close()
    } else {
        console.warn("No modal found:", id)
    }
}


const projectlistUI = document.getElementById("project-list") as HTMLDivElement
const projectManager = new ProjectManager(projectlistUI)

// KLickar på knappen "New Project" och skapar en ny div med klassen "project" 
const newProjectBtn= document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
    console.warn("No new project button found")
}




 /*KLickar på knappen "New Project" och skapar en ny div med klassen "project" 
const closeBtn=document.getElementById("close-btn")
if (closeBtn) {
    closeBtn.addEventListener("click", () => {closeModal("new-project-modal")})
} else {
    console.warn("No new closed button found")
}
*/
/*
function nameLength(){
    const nameInput = document.getElementById("name") as HTMLInputElement
    if (nameInput.value.length > 5) {
        return false
        console.warn("Name length is greater than 5 letters");
    }
}
*/

const projectForm = document.getElementById("new-project-form")

if(projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (event) => {
        event.preventDefault() // förhindrar att sidan laddas om
        const formData = new FormData(projectForm) // skapar en ny instans av FormData
        const projectProperty: IProject = { // skapar en ny variabel med objektet
            description: formData.get("description") as string, // hämtar värdet från inputfälten
            name: formData.get("name") as string,  // hämtar värdet från inputfälten
            role: formData.get("role") as role,// hämtar värdet från inputfälten och giltigöra att det är av typen role
            status: formData.get("status") as status, // hämtar värdet från inputfälten och giltigöra att det är av typen status
            date: new Date (formData.get("date") as string) //
        }
        
 
try {
    const project = projectManager.newProject(projectProperty) // skapar en ny variabel som är av typen projectManager och kallar på metoden newProject
   // nameLength()
    projectForm.reset() // rensar inputfälten
    toggleModal("new-project-modal")
    console.log(project)



    } catch (error) {
       const errorElement = document.getElementById("pop-up-modal") as HTMLElement
        //errorElement.innerHTML  // skapar en ny div med innehåll enligt "pop-up-modal elementet"
        errorElement.style.display = "flex"; // Visar elementet som normalt är dolt
        const closeBtnPopup = document.getElementById("close-pop-up-btn")
        if (closeBtnPopup) {
          closeBtnPopup.addEventListener("click", () => {
          errorElement.style.display = "none"; // släcker ner elementet
        });

        }
    }
}) //end of eventlistener

const closeBtn = document.getElementById("close-btn")
closeBtn.addEventListener("click", (event) => {closeModal("new-project-modal")})   
closeModal("new-project-modal")
console.log(closeBtn)


}   else {
    console.warn("No project form found")
}


const exportBtn = document.getElementById("export-btn")
if(exportBtn)  {
    exportBtn.addEventListener("click", () => {
        projectManager.exportJSON()
      })
}

const importBtn = document.getElementById("import-btn")
if(importBtn)  {
    importBtn.addEventListener("click", () => {
        projectManager.importJSON()
      })
}

