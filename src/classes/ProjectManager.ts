import { Input } from 'postcss';
import { Project, IProject } from './Project';
import { showModal, toggleModal,  } from './Modal';

//import * as showModal from "./"

export class ProjectManager {
   // interna clsser/property
    list: Project[] = [] // skapar en ny array med typen Project
    ui: HTMLDivElement // skapar en ny variabel som är av typen HTMLDivElement
    id: string

// constructor
    constructor(container: HTMLDivElement) {
        this.ui = container
        const project = this.newProject({
            name: "defaul Project",
            description: "this is just a default PRoject",
            status: "pending",
            role: "Admin", 
            date: new Date()
        })
        if (project) {
            project.ui.click();
        }

    }
    newProject(data: IProject) { // skapar en ny metod som tar in data av typen IProject
        const projectNames = this.list.map((project) =>  {
            return project.name
        })

        //M2-Assigment Q#3
        const nameToLong = data.name.length > 5
        if (nameToLong){
            console.warn("för långt namn")
            return false 
        } 
        const nameInUse = projectNames.includes(data.name)
            if (nameInUse) {
                throw new Error(data.name + "finns redan") // skapar en ny error som skickar ut ett meddelande om att namnet redan finns
                
        }
        
        const project = new Project(data);
        project.ui.addEventListener("click", () => {
            const projectPage = document.getElementById("project-page") as HTMLDivElement   
            const detailsPage = document.getElementById("project-details") as HTMLDivElement
            if (!detailsPage) {return}
            projectPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project, this.id)

                
                
                
        })  
        const projectPage = document.getElementById("project-page") as HTMLDivElement;
        const homePageButton = document.getElementById("homebtn") as HTMLButtonElement;
        if (homePageButton) {
            homePageButton.addEventListener("click", ()=>
            projectPage.style.display = "flex"
         
            )   
        }
            
        this.ui.append(project.ui);
        this.list.push(project);
            return project
        }

        
        
 
        setDetailsPage(project: Project, id: string) {
            const detailsPage = document.getElementById("project-details") as HTMLDivElement
            this.id = project.id
            if (!detailsPage) {return}
                const name = document.querySelector("[data-project-info='name']")
                const description = document.querySelector("[data-project-description='description']")
                const role = document.querySelector("[card-project-role='role']")
                const status = document.querySelector("[card-project-status='card-status']")
                const date = document.querySelector("[card-data-date='date']") 
                //M2-Assignment Q#1
                const nameIcon= document.querySelector("[class-header-class='dashboard-card-header']")

                if (name && description && role && status && date && nameIcon) {	
                    name.textContent = project.name
                    description.textContent = project.description
                    role.textContent = project.role
                    status.textContent = project.status 
                    date.textContent = project.date.toDateString()
                    //M2-Assignment Q#1
                    nameIcon.textContent = project.name.substring(0,2)
                }
        }


//M2-Assignment Q#5
        getProject(id:string) {
            console.log(`Searching for project with id: ${id}`);
            const project = this.list.find((project) => {
                console.log(`Checking project with id: ${project.id}`);
                return project.id === id;
            })
            if (project) {
                console.log(`Found project with id: ${project.id}`);
            } else {
                console.log(`No project found with id: ${id}`);
            }
            return project;
        }

        deleteProject(id: string) {
            const project = this.getProject(id)
            if (!project) {return}
            project.ui.remove()

            const remaining = this.list.filter((project) => {
                return project.id !== id
            })
            this.list = remaining
        }

        getTotalCost() {
            const totalCost = this.list.reduce((accumulator, project) => accumulator + project.cost, 0);
            return totalCost;
        }

        
        getProjectbyName(id: string) {
            const projectname = this.list.find((project) => {project.name
                return projectname.name === id
            })
            
            
        }
        updateProject(updatedProject: Project) {
            const project = this.list.find(project => project.id === updatedProject.id);
            if (!project) {
                throw new Error('Project not found');
            }
            this.list = this.list.map(project => project.id === updatedProject.id ? updatedProject : project)
        }

        addProject(project: Project) {
            this.list.push(project);
        }

        exportJSON(filename: string = "projects.json") {
            const json = JSON.stringify(this.list, null, 2)
            const blob = new Blob([json], {type: "application/json"}) // skapar en ny blob
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "projects.json"
            a.click()
            URL.revokeObjectURL(url)
        }


        importJSON(){
            const input = document.createElement(`input`)
            input.type = `file`
            input.accept = `application/json`
            const reader = new FileReader()
            reader.addEventListener( "load", () => {
                const json = reader.result
                if (!json) {return}
                const projects: IProject[] = JSON.parse(json as string)
                for (const project of projects) {
                    try {
                        this.newProject(project)
                    } catch (error) {
                        console.warn(error)
                    }
                } 
            })


            input.addEventListener(`change`, () => {
                const filelist = input.files
                if (!filelist) {return}
                reader.readAsText(filelist[0])
            })
            input.click()
        }
        
    }
