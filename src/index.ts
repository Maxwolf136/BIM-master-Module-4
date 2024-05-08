import * as THREE from "three"
import * as OBC from "openbim-components"
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min"
import { IProject, Project, role, status } from "./classes/Project"
import { ProjectManager } from "./classes/ProjectManager"
import { closeModal, showModal, toggleModal, } from "./classes/Modal"
import { Container } from "postcss"

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import { FragmentsGroup } from "bim-fragment"
import { TodoCreator } from "./bim-components/ToDoCreator"
import { TodoCard } from "./bim-components/src/TodoCard"
import { SimpleQTO } from "./bim-components/SimpleQTO"


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

//Edit-projectinformation
// Get a reference to the "Edit-button"



//M2-Assignment Q#5
const editForm = document.getElementById("edit-project-form") as HTMLFormElement


if (editForm instanceof HTMLFormElement) {
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const projectID =  projectManager.id
        const projectToUpdate = projectManager.getProject(projectID)

        if(projectToUpdate) {
            projectToUpdate.description = formData.get("description") as string,
            projectToUpdate.name = formData.get("name") as string,  // hämtar värdet från inputfälten
            projectToUpdate.role = formData.get("role") as role,// hämtar värdet från inputfälten och giltigöra att det är av typen role
            projectToUpdate.status= formData.get("status") as status, // hämtar värdet från inputfälten och giltigöra att det är av typen status
            projectToUpdate.date = new Date (formData.get("date") as string) //
        }

        
        try {
            if (projectToUpdate) {
                projectManager.setDetailsPage(projectToUpdate, projectID); // Call the setDetailsPage method with the project and project.id
                projectToUpdate.setUI()
                editForm.reset(); // Reset the input fields
                toggleModal("edit-project-modal");
                console.warn(projectToUpdate);
                
            }
        } catch (error) {
            // Handle the error
        }
        const errorElement = document.getElementById("pop-up-modal") as HTMLElement
                errorElement.style.display = "flex"; // Visar elementet som normalt är dolt

                const closeBtnPopup = document.getElementById("close-pop-up-btn")
                if (closeBtnPopup) {
                  closeBtnPopup.addEventListener("click", () => {
                  errorElement.style.display = "none"; // släcker ner elementet
                });
                }

            }
    )
    };




const geometry = new THREE.CapsuleGeometry( 1, 1, 4, 8 ); 
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
const capsule = new THREE.Mesh( geometry, material );


/*
//OBC viewer

const viewer = new OBC.Components()

const sceneComponent = new OBC.SimpleScene(viewer)
viewer.scene = sceneComponent
const scene = sceneComponent.get()
sceneComponent.setup()

scene.background = null

const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement
const renderComponet = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = renderComponet

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera = cameraComponent

const raycasterComponent = new OBC.SimpleRaycaster(viewer)
viewer.raycaster = raycasterComponent

viewer.init()
cameraComponent.updateAspect()
renderComponet.postproduction.enabled =  true

const ifcLoader = new OBC.FragmentIfcLoader(viewer)
ifcLoader.uiElement.get("main")
ifcLoader.settings.wasm = {
    path: "https://unpkg.com/web-ifc@0.0.43/",
    absolute: true
}

const highlighter = new OBC.FragmentHighlighter(viewer)
highlighter.setup()


const toolbar = new OBC.Toolbar(viewer)
toolbar.addChild(
    ifcLoader.uiElement.get("main")
)

ifcLoader.onIfcLoaded.add((model) => {
    highlighter.update()
    classifier.byStorey(model)
    classifier.byEntity(model)
    console.log(classifier.get())
    console.log(model)
})
viewer.ui.addToolbar(toolbar)

//Classifier
const classifier = new OBC.FragmentClassifier(viewer)

const clasifcationWindow = new OBC.FloatingWindow(viewer)
viewer.ui.add(clasifcationWindow)
*/

//Viewer OBC
const viewer = new OBC.Components()

const sceneComponent = new OBC.SimpleScene(viewer)
sceneComponent.setup()
viewer.scene = sceneComponent
const scene = sceneComponent.get()
scene.background = null

const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera = cameraComponent

const raycasterComponent = new OBC.SimpleRaycaster(viewer)
viewer.raycaster = raycasterComponent

viewer.init()
cameraComponent.updateAspect()
rendererComponent.postproduction.enabled = true

const fragmentManager = new OBC.FragmentManager(viewer)

function exportFragment(model: FragmentsGroup) {
    const fragmentBinary = fragmentManager.export(model)
    const blob = new Blob([fragmentBinary]) // skapar en ny blob
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${model.name.replace(".ifc","")}.frag`
    a.click()
    URL.revokeObjectURL(url)
}

function exportJSONModel(model:FragmentsGroup) {
    const json = JSON.stringify(model)
    const blob = new Blob([json], {type: "application/json"}) // skapar en ny blob
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${model.name.replace(".ifc","")}.json`
    a.click()
    URL.revokeObjectURL(url)
}

function importJSONModel(model:FragmentsGroup) {
    const input = document.createElement(`input`)
    input.type = `file`
    input.accept = `application/json`
    const reader = new FileReader()
    reader.addEventListener( "load", () => {
        const json = reader.result
        if (!json) {return}
        model.properties = JSON.parse(json as string)
    })


    input.addEventListener(`change`, () => {
        const filelist = input.files
        if (!filelist) {return}
        reader.readAsText(filelist[0])
    })
    input.click()
}



const ifcLoader = new OBC.FragmentIfcLoader(viewer)
ifcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.43/",
  absolute: true
}

const highlighter = new OBC.FragmentHighlighter(viewer)

highlighter.setup()

const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
highlighter.events.select.onClear.add(() => {
    propertiesProcessor.cleanPropertiesList()
})



const classifier = new OBC.FragmentClassifier(viewer)

const clasifcationWindow = new OBC.FloatingWindow(viewer)
viewer.ui.add(clasifcationWindow)
clasifcationWindow.visible = false
clasifcationWindow.title = "Modellträd"

const classifcationBtn = new OBC.Button(viewer)
classifcationBtn.materialIcon ="account_tree"

classifcationBtn.onClick.add(() =>{
    clasifcationWindow.visible = !clasifcationWindow.visible
    clasifcationWindow.active = clasifcationWindow.visible
})

async function createModalTree() {
    const fragmentTree = new OBC.FragmentTree(viewer)
    await fragmentTree.init()
    await fragmentTree.update(["model","storeys","entities"])
    fragmentTree.onHovered.add((fragmentMap) => {
        highlighter.highlightByID("hover", fragmentMap)
      })
      fragmentTree.onSelected.add((fragmentMap) => {
        highlighter.highlightByID("select", fragmentMap)
      })
    const tree = fragmentTree.get().uiElement.get("tree")
    return tree
}

//LOD kan man säga
const culler = new OBC.ScreenCuller(viewer)
cameraComponent.controls.addEventListener("sleep",  () =>{
    culler.needsUpdate = true
})


async function onModelLoaded(model: FragmentsGroup) {

    try {
        highlighter.update()
        for(const fragment of model.items) {culler.add(fragment.mesh)}
        culler.needsUpdate = true
        classifier.byModel(model.name, model)
        classifier.byStorey(model)
        classifier.byEntity(model)
        const tree = await  createModalTree()
        console.log(classifier.get())
        await clasifcationWindow.slots.content.dispose(true)
        clasifcationWindow.addChild(tree)
        console.log(model)
    
        propertiesProcessor.process(model)
        highlighter.events.select.onHighlight.add((fragmentmap) =>{
            const expressID = [...Object.values(fragmentmap)[0]][0]
            propertiesProcessor.renderProperties(model, Number(expressID) )
    
        })
    } catch (error) {
        console.warn(error)
    }
}



ifcLoader.onIfcLoaded.add(async(model) => {
    exportFragment(model)
    onModelLoaded(model)
    exportJSONModel(model)
})


fragmentManager.onFragmentsLoaded.add((model) => {
    onModelLoaded(model)
    importJSONModel(model)
    console.log(model)
})

const importFragmentBtn = new OBC.Button(viewer)
importFragmentBtn.materialIcon = "upload"
importFragmentBtn.tooltip = "load FRAG"

importFragmentBtn.onClick.add(() => {
    const input = document.createElement(`input`)
    input.type = `file`
    input.accept = `.frag`
    const reader = new FileReader()
    reader.addEventListener( "load", async() => {
        const binary = reader.result
        if(!(binary instanceof ArrayBuffer)) {return}
        const fragmentBinary = new Uint8Array(binary)
        await fragmentManager.load(fragmentBinary)
    })
 
    input.addEventListener(`change`, () => {
        const filelist = input.files
        if (!filelist) {return}
        reader.readAsArrayBuffer(filelist[0])
    })
    input.click()
})

const toDoCreator = new TodoCreator(viewer)
await toDoCreator.setup()
toDoCreator.onProjectCreated.add((todo) =>{
console.log(todo)
})

const simpleQto = new SimpleQTO(viewer)
await simpleQto.setup()


const propertiesFinder = new OBC.IfcPropertiesFinder(viewer)
await propertiesFinder.init()
propertiesFinder.onFound.add((fragmentIDMap) => {
    highlighter.highlightByID("select", fragmentIDMap)
  })

//TOOLBAR

const toolbar = new OBC.Toolbar(viewer)
toolbar.addChild(
  ifcLoader.uiElement.get("main"),
  classifcationBtn,
  propertiesProcessor.uiElement.get("main"),
  importFragmentBtn,
  fragmentManager.uiElement.get("main"),
  toDoCreator.uiElement.get("activationButton"),
  simpleQto.uiElement.get("activationBtn"),
  propertiesFinder.uiElement.get("main"),
  
)
viewer.ui.addToolbar(toolbar)

