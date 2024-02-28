import { Project, IProject } from './Project';


export class ProjectManager {
   // interna clsser/property
    list: Project[] = [] // skapar en ny array med typen Project
    ui: HTMLDivElement // skapar en ny variabel som är av typen HTMLDivElement

// constructor
    constructor(container: HTMLDivElement) {
        this.ui = container

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
                if (!projectPage || !detailsPage) {return}
                projectPage.style.display = "none"
                detailsPage.style.display = "flex"
                this.setDetailsPage(project)
        })
            this.ui.append(project.ui)
            this.list.push(project)
            return project
        }
 
        private setDetailsPage(project: Project) {
            const detailsPage = document.getElementById("project-details") as HTMLDivElement

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

        editProjectInformation(id: string, data: IProject) {
            const editProjectbtn = document.getElementById("btn-secondary") as HTMLButtonElement
            if(editProjectbtn) {
                editProjectbtn.addEventListener('click', () => {
                    const projectInformation = this.getProject(id)
                    if(!projectInformation){
                        console.warn ("no project found")
                        return
                    }
                projectInformation.name = data.name
                projectInformation.description = data.description;
                projectInformation.role = data.role;
                projectInformation.status = data.status;
                projectInformation.date = new Date(data.date);
                projectInformation.cost = data.cost;

                const projectInfo = document.getElementById (projectInformation.id)
                if (!projectInfo) {return}
                
                
                }) 
            }
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
            const blob = new Blob([json], {type: "application/json"}) // skapar en ny blob
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "projects.json"
            a.click()
            URL.revokeObjectURL(url)
        }

        //test editera
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