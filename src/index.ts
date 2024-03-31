import { IProject, Project, role, status } from "./classes/Project"
import { ProjectManager } from "./classes/ProjectManager"
import { closeModal, showModal, toggleModal, } from "./classes/Modal"


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
    toggleModal ("new-project-modal")
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
// Get a reference to the "Edit-button"
const editButton = document.getElementById("edit-button") as HTMLButtonElement;
if (editButton) {
    // Add a click event listener to the "Edit-button"
    editButton.addEventListener("click", () => {
        // Create a new instance of the modal class and show the modal
       showModal("edit-project-modal")

        const editForm = document.getElementById("edit-project-form") as HTMLFormElement;
        if (editForm instanceof HTMLFormElement) {
            editForm.addEventListener("submit", (event) => {
                // Prevent the form from submitting normally
                event.preventDefault();

                // Get the form data
                const formData = new FormData(editForm);
                //OBJEKT
                const projectProperty: IProject = {
                    description: formData.get('description') as string,
                    name: formData.get('name') as string,
                    role: formData.get('role') as role,
                    status: formData.get('status') as status,
                    date: new Date(formData.get('date') as string)
                };
            
                
                const currentProject = projectManager.getProject(editForm.dataset.projectId as string);
                console.log('Project ID:', editForm.dataset.projectId); // Debugging statement
                console.log('Current project:', currentProject); // Debugging statement
            if (currentProject) {
                // Update the properties of the current project
                currentProject.description = projectProperty.description;
                currentProject.name = projectProperty.name;
                currentProject.role = projectProperty.role;
                currentProject.status = projectProperty.status;
                currentProject.date = projectProperty.date;
            
                projectManager.updateProject(currentProject);
                projectManager.setDetailsPage(currentProject, id);
            }

           /* const updateBtn = document.getElementById("updateBtn") as HTMLButtonElement;
            if (updateBtn) {
                updateBtn.addEventListener("click", () => {
                    const formData = new FormData(editForm);

                    const newProject: IProject = {
                        description: formData.get('description') as string,
                        name: formData.get('name') as string,
                        role: formData.get('role') as role,
                        status: formData.get('status') as status,
                        date: new Date(formData.get('date') as string)
                    };
                    const project = new Project(newProject);
                    projectManager.newProject(project);
                    projectManager.setDetailsPage(project);
                })
            } */


            const closeBtn = document.getElementById("close-btn")
            closeBtn.addEventListener("click", (event) => {closeModal("edit-project-modal")})   
            event.preventDefault()
            closeModal("edit-project-modal")
            
    });
}
})
}
