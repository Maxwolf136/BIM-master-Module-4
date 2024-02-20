import { Project, IProject } from './Project';

export class ProjectManager {
   // interna clsser/property
    list: Project[] = [] // skapar en ny array med typen Project
    ui: HTMLDivElement // skapar en ny variabel som är av typen HTMLDivElement


    constructor(container: HTMLDivElement) {
        this.ui = container

    }
        newProject(data: IProject) { // skapar en ny metod som tar in data av typen IProject
            const projectNames = this.list.map((project) =>  {
                return project.name
            })
            const nameInUse = projectNames.includes(data.name)
                if (nameInUse) {
                    throw new Error(data.name + "finns redan") // skapar en ny error som skickar ut ett meddelande om att namnet redan finns
                    
                }
                
            const project = new Project(data)
            project.ui.addEventListener("click", () => {
                const projectPage = document.getElementById("project-page") as HTMLDivElement   
                const detailsPage = document.getElementById("project-details") as HTMLDivElement
                if (!projectPage || !detailsPage) {return}
                projectPage.style.display = "none"
                detailsPage.style.display = "flex"
        })
            this.ui.append(project.ui)
            this.list.push(project)
            return project
        }
 
        getProject(id:string) {
            const project= this.list.find((project) => {
                return project.id === id      
            })
            return project
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


        exportJSON(filename: string = "projects.json") {
            const json = JSON.stringify(this.list, null, 2)
            const blob = new Blob([json], {type: "application/json"})
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
                } // Add this closing curly brace
            })


            input.addEventListener(`change`, () => {
                const filelist = input.files
                if (!filelist) {return}
                reader.readAsText(filelist[0])
            })
            input.click()
        }
    }