// Getting elements from DOM
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// Show or hide handlers
const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")
const cleanContainer = (selector) => $(selector).innerHTML = ""

const showElements = (selectors) => {
    for (const selector of selectors){
        $(selector).classList.remove("hidden")
    }
}

const hideElements = (selectors) => {
    for (const selector of selectors){
        $(selector).classList.add("hidden")
    }
}

let isSubmit = false

const getJobs = () => {
    fetch(`https://6487a64cbeba62972790dfa2.mockapi.io/jobs`)
    .then(res => res.json())
    .then(jobs => renderJobs(jobs))
}

const getJob = (jobId) => {
    fetch(`https://6487a64cbeba62972790dfa2.mockapi.io/jobs/${jobId}`)
    .then(res => res.json())
    .then(job => renderJob(job))
}
const editJob =(jobId)=>{
    fetch(`https://6487a64cbeba62972790dfa2.mockapi.io/jobs/${jobId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveJob(jobId))
    }).finally(() => window.location.reload())
}

const renderJobs = (jobs) => {
    showElement("#spinner")
    if (jobs) {
        cleanContainer("#preview-card")
        setTimeout(() => {
            hideElement("#spinner")
            
            for (const {id, name, image, location, category, languages, seniority, salary } of jobs) {
                const displayedLanguages = generateDisplayedLanguages(languages)
                const languageHTML = displayedLanguages.map(language => `<span>${language}</span>`).join(', ')
                
                $("#preview-card").innerHTML += `
                <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4">
                    <div class="max-w-xs rounded overflow-hidden shadow-lg">
                    <div class="card-image bg-cover bg-center" style="background-image: url('${image}')"></div>
                        <div class="px-6 py-4">
                            <h2 class="font-bold text-xl mb-2">${name}</h2>
                            <div class="">
                            <p class="flex text-base text-gray-700 mb-2"><i class="fa-solid fa-location-dot mt-1 mr-2"></i>${location}</p>
                            <p class="flex text-base text-gray-700 mb-2"><i class="fa-solid fa-briefcase mt-1 mr-2"></i>${category}</p>
                            <p class="flex text-base text-gray-700 mb-2"><i class="fa-solid fa-gears mt-1 mr-2"></i>${languageHTML}</p>
                            </div>
                            <div class="pt-4 pb-2">
                            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${seniority}</span>
                            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">$${salary}</span>
                            </div>
                            <button onclick="detailsCard('${id}')" class="btn-see-datails mb-4 px-4 py-2 inline-block bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2 hover:bg-blue-700">See details<i class="fa-solid fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                `
            }  
        }, 2000)
    }
}
const generateDisplayedLanguages = (languages) => {
    const maxLanguages = 3
    const displayedLanguages = languages.slice(0, maxLanguages)
    const extraLanguagesCount = languages.length - maxLanguages
    if (extraLanguagesCount > 0) {
      displayedLanguages.push(`(...)`)
    }
    return displayedLanguages
}
const detailsCard = (jobId) => {
    getJob(jobId)
    hideElement("#preview-card")
    hideElement("#filters")
    showElement("#card-details")
    showElement(".container-card")
}

//arreglar el setTimeout
const renderJob = ( {id, name, image, location, category, languages, seniority, salary, description, benefits: { internet_paid, health_insurance, vacation } } ) => {    
    showElement("#spinner")
    setTimeout(() => {
        hideElement("#spinner")
        showElement("#card-details")
        showElement(".container-card")

        $("#card-details").innerHTML += `
        <div class="card-image bg-cover bg-center" style="background-image: url('${image}')"></div>
        <div class="flex-colum">
            <h2 class="text-gray-600 text-2xl font-semibold mb-4">${name}</h2>
            <p class="mb-2">${description}</p>
            <hr>
            <div>
                <p class="flex text-base text-gray-700 mt-2 mb-2"><i class="fa-solid fa-location-dot mt-1 mr-2"></i>${location}</p>
                <p class="flex text-base text-gray-700 mb-2"><i class="fa-solid fa-briefcase mt-1 mr-2"></i>${category} / ${seniority} </p>
                <p class="flex text-base text-gray-700 mb-3"><i class="fa-solid fa-gears mt-1 mr-2"></i>${languages}</p>
                <p class="flex text-base text-gray-700 mb-3"><i class="fa-solid fa-sack-dollar mt-1 mr-2"></i>$${salary}</p>
            </div>
            <hr>
            <div>
                <h3 class="mt-2">Benefits</h3>
                <span class="text-gray-700 mb-2"><i class="fa-solid fa-square-check text-green-600 mr-1"></i>${internet_paid ? "Internet Paid" : "Internet Part Payment"} |</span>
                <span class="text-gray-700 mb-2 span-hinsurance"><i class="fa-solid fa-square-check text-green-600 mr-1"></i>${health_insurance === "Yes" ? $("#h-insurance-type").value : "" }  |</span>
            </div>
            <div class="flex mt-5 mb-3">
                <button onclick="editJobs('${id}')" class="btn-edit px-4 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white mr-2" data-id="${ id }">Edit</button>
                <button class="btn-delete px-4 py-1 bg-red-600 hover:bg-red-700 active:bg-red-700 rounded-md text-white" data-id="${ id }">Delete</button>
            </div>
        </div>
        `
        
        
    }, 2000)
}
/* <span class="text-gray-700 mb-2 span-hinsurance"><i class="fa-solid fa-square-check text-green-600 mr-1"></i>${health_insurance === "Yes" ? $("#h-insurance-type").value : $(".span-hinsurance").classList.add("hidden") }  |</span>
<span class="text-gray-700 mb-2 span-vacation"><i class="fa-solid fa-square-check text-green-600 mr-1"></i>${vacation === "Yes" ? $("#vacation-time").value : $(".span-vacation").classList.add("hidden") } |</span> */

const saveJob = () => {
    return {
        name: $("#name").value, 
        image: $("#image").value,
        description: $("#description").value,
        languages: [
            $("#language-one").value,
            $("#language-two").value,
            $("#language-three").value,
            $("#language-four").value,
            $("#language-five").value
        ], 
        category: $("#category").value,
        seniority: $("#seniority").value, 
        location: $("#location").value,
        benefits: {
            vacation: $(".vacation").value,
            health_insurance: $(".healt_insurance").value, 
            internet_paid: $(".internet_paid").value
        }
    }
}
const editJobs = () => {
    hideElements(["#add-btn","#create-job"])
    $("#change-edit").innerText = "edit"
    showElements(["#edit-btn", "#form-job", "#edit-job" ])
    const userId = $(".btn-edit").getAttribute("data-id")
    $("#edit-btn").setAttribute("data-id", userId) 
    isSubmit = true   
}
const populateForm = ( {} )

const initializaApp = () => {
    $("#create-job").addEventListener("click", (e) => {
        e.preventDefault()
        showElement("#form-job")
        hideElement("#preview-card")
        hideElement("form")
    })
    
    $(".fa-bars").addEventListener("click", () => {
        hideElement(".fa-xmark")
        showElement("#menu")
    })
    $(".fa-xmark").addEventListener("click", () => {
        hideElement(".fa-bars")
        hideElement("#menu")
    })
}
        

    

window.addEventListener("load", () => {
    initializaApp()
    getJobs()
    getJob()
    
}) 
    

