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

// *** FETCH METHODS ***
const getJobs = (jobId = "") => {
    fetch(`https://6487a64cbeba62972790dfa2.mockapi.io/jobs/${jobId}`)
    .then(res => res.json())
    .then(job => {
        if (jobId == "") {
            renderJobs(job)
        } else {
            populateForm(job)
        }
    })
}

const getJobDetail = (jobId) => {
    fetch(`https://6487a64cbeba62972790dfa2.mockapi.io/jobs/${jobId}`)
    .then(res => res.json())
    .then(job => renderJob(job)) 
}

const createJob = () => {
    fetch(`https://6487a64cbeba62972790dfa2.mockapi.io/jobs`, {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveJobInformation())
    })
}
const editJob = (jobId) => {
    fetch(`https://6487a64cbeba62972790dfa2.mockapi.io/jobs/${jobId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveJobInformation(jobId))
    }).finally(() => window.location.reload())
}
const deleteJob = (jobId) => {
    fetch(`https://6487a64cbeba62972790dfa2.mockapi.io/jobs/${jobId}`, {
        method: "DELETE",
    }).finally(() => window.location.reload())
}

const filterFetch = (params) => {
    fetch(`https://6487a64cbeba62972790dfa2.mockapi.io/jobs/?${params ? `${params}` : "" }`)
    .then(res => res.json())
    .then(jobs => renderJobs(jobs))
}

// *** REUSABLE FUNCTIONS ***
const getParams = (key, selector) => {
    const params = {
        [key]: $(selector).value
    }
    const url = new URLSearchParams(params).toString()
    return url
}

let isSubmit = false

// *** RENDERS ***
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
                    <div class="card-image bg-cover bg-center" style="background-image: url('${image ? image : "https://fakeimg.pl/600x400/689cc5/adc6db?text=Default+Image"}')"></div>
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
                            <button class="btn-see-datails mb-4 px-4 py-2 inline-block bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2 hover:bg-blue-700" data-id="${ id }">See details<i class="fa-solid fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                `
                
            }
            for (const btn of $$(".btn-see-datails")){
                btn.addEventListener("click", () => {
                    hideElements(["#preview-card", "#filters"])
                    showElements(["#card-details", ".container-card"])
                    const jobId = btn.getAttribute("data-id")
                    getJobDetail(jobId)
                })
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


const renderJob = ( {id, name, image, location, category, languages, seniority, salary, description, benefits:{health_insurance, internet_paid, vacation } } ) => {    
    showElement("#spinner")
    setTimeout(() => {
        hideElement("#spinner")
        showElement("#card-details")
        showElement(".container-card")


        $("#card-details").innerHTML += `
        <div class="card-image bg-cover bg-center" style="background-image: url('${image ? image : "https://fakeimg.pl/600x400/689cc5/adc6db?text=Default+Image"}')"></div>
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
                <h3 class="my-2 ">Benefits</h3>
                <p class="text-gray-700 mb-2"><i class="fa-solid fa-globe text-blue-500 mr-1"></i> ${internet_paid ? "Internet Paid" : "No Paid Internet" } </p>
                <p class="text-gray-700 mb-2"><i class="fa-solid fa-user-doctor text-blue-500 mr-1"></i> ${health_insurance} </p>
                <p class="text-gray-700 mb-2"><i class="fa-solid fa-plane text-blue-500 mr-1"></i> ${vacation}</p>
            </div>
            <div class="flex mt-5 mb-3">
                <button class="btn-edit px-4 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white mr-2" data-id="${ id }">Edit</button>
                <button class="btn-delete px-4 py-1 bg-red-600 hover:bg-red-700 active:bg-red-700 rounded-md text-white" data-id="${ id }">Delete</button>
            </div>
        </div>
        `
        $(".btn-edit").addEventListener("click", () => {
            hideElements(["#add-btn", "#add-job"])
            $("#change-edit").innerText = "edit"
            showElements(["#edit-btn", "#form-job", "#edit-job" ])
            const jobId = $(".btn-edit").getAttribute("data-id")
            $("#edit-btn").setAttribute("data-id", jobId) 
            isSubmit = false
            getJobs(jobId)
        })

        $(".btn-delete").addEventListener("click", () => {
            showElement("#modal-window")
            hideElements(["#card-details", "#form-job"])
            $(".modal-text").innerHTML = `${name}`
            const jobId = $(".btn-delete").getAttribute("data-id")
            $("#modal-delete").setAttribute("data-id", jobId)
        }) 
    }, 2000)
    
}

// *** OBJECT DATA ***

const saveJobInformation = () => {
    return {
        "name": $("#name").value, 
        "image": $("#image").value,
        "description": $("#description").value,
        "salary": $("#salary").value,
        "languages": [
            $("#language-one").value,
            $("#language-two").value,
            $("#language-three").value,
            $("#language-four").value,
        ], 
        "category": $("#category").value,
        "seniority": $("#seniority").value, 
        "location": $("#location").value,
        "benefits": {
            "vacation" : $("#vacation-time").value,
            "health_insurance": $("#h-insurance-type").value,
            "internet_paid":  $$(".internet_paid")[0].checked ? true : false
        }
    }
}

const populateForm = ({name, image, description, salary, languages, category, seniority, location, benefits }) => {
    $("#name").value = name 
    $("#image").value = image
    $("#description").value = description
    $("#salary").value = salary
    $("#language-one").value = languages[0]
    $("#language-two").value = languages[1]
    $("#language-three").value = languages[2]
    $("#language-four").value = languages[3]
    $("#category").value = category
    $("#seniority").value = seniority
    $("#location").value = location
    $("#vacation-time").value  = benefits.vacation
    $("#h-insurance-type").value = benefits.health_insurance
    if ($$(".internet_paid")[0].checked){
        $(".internet_paid").value = benefits.internet_paid
    } else {
        $$(".internet_paid")[1].checked = true
    }
}

// *** VALIDATIONS ***
const validateJobForm = () => {
    const name = $("#name").value.trim()
    const description = $("#description").value.trim()
    const salary =  $("#salary").valueAsNumber
    const language = $("#language-one").value.trim()
    const vacationTime = $("#vacation-time").value.trim()
    const insuranceType = $("#h-insurance-type").value.trim()
    const category = $("#category").value
    const location = $("#location").value
    const seniority = $("#seniority").value

    if (name === ""){
        $("#name").classList.add("border-red-600")
        showElement(".name-error")
    } else {
        $("#name").classList.remove("border-red-600")
        hideElement(".name-error")
    }

    if (description === ""){
        $("#description").classList.add("border-red-600")
        showElement(".description-error")
    } else {
        $("#description").classList.remove("border-red-600")
        hideElement(".description-error")
    }

    if (isNaN(salary)) {
        $("#salary").classList.add("border-red-600")
        showElement(".salary-error")
    } else {
        $("#salary").classList.remove("border-red-600")
        hideElement(".salary-error")
    }

    if (language === ""){
        $("#language-one").classList.add("border-red-600")
        showElement(".language-error")
    } else {
        $("#language-one").classList.remove("border-red-600")
        hideElement(".language-error")
    }

    if (category === "") {
        $("#category").classList.add("border-red-600")
        showElement(".category-error")
    } else {
        $("#category").classList.remove("border-red-600")
        hideElement(".category-error")
    }

    if (location === "") {
        $("#location").classList.add("border-red-600")
        showElement(".location-error")
    } else {
        $("#location").classList.remove("border-red-600")
        hideElement(".location-error")
    }

    if (seniority === "") {
        $("#seniority").classList.add("border-red-600")
        showElement(".seniority-error")
    } else {
        $("#seniority").classList.remove("border-red-600")
        hideElement(".seniority-error")
    }

    if (vacationTime === "") {
        $("#vacation-time").classList.add("border-red-600")
        showElement(".vtime-error")
    } else {
        $("#vacation-time").classList.remove("border-red-600")
        hideElement(".vtime-error")
    }

    if (insuranceType === "") {
        $("#h-insurance-type").classList.add("border-red-600")
        showElement(".hinsurance-error")
    } else {
        $("#h-insurance-type").classList.remove("border-red-600")
        hideElement(".hinsurance-error")
    }

    return name !== "" && description !== "" && !isNaN(salary) && language !== "" && category !== "" && location !== "" && seniority !== "" && vacationTime !== "" && insuranceType !== "" 
}

const initializaApp = () => {
    getJobs()

    $("#create-job").addEventListener("click", (e) => {
        e.preventDefault()
        showElements(["#form-job", "#add-job"])
        hideElements(["#preview-card", "form", "#card-details", "#edit-job"])
        $("#change-edit").innerText = "create"
        $("#form-create-job").reset()
        isSubmit = true
    })

    $("#add-btn").addEventListener("click", () => {
        showElement("#succesfull-alert")
        setTimeout( () => {
            hideElement("#succesfull-alert")

        }, 2000)
    })
    $("#edit-btn").addEventListener("click", () => {
        showElement("#succesfull-alert")
        setTimeout( () => {
            hideElement("#succesfull-alert")

        }, 2000)
    })
    
    $("#close-succesfull-alert").addEventListener("click", () => {
        hideElement("#succesfull-alert")
    })

    //open and close mobile menu
    $("#open-menu").addEventListener("click", () => {
        showElements(["#close-menu", "#menu"])
        hideElement("#open-menu")
    })
    $("#close-menu").addEventListener("click", () => {
        showElement("#open-menu")
        hideElements(["#close-menu", "#menu"])
    })
    
    //save and edit job
    $("#form-create-job").addEventListener("submit", (e) => {
        e.preventDefault()
        if (validateJobForm()) {
            if (isSubmit) {
                createJob()
            } else {
                const jobId = $("#edit-btn").getAttribute("data-id")
                editJob(jobId)
            }
        } 
        $("#form-create-job").reset()
    })
    // modals to delete and cancel
    $("#modal-delete").addEventListener("click", () => {
        const jobId = $("#modal-delete").getAttribute("data-id")
        deleteJob(jobId)
    })
    $("#modal-cancel").addEventListener("click", () => {
        hideElement("#modal-window")
        window.location.reload()
    }) 
    // filters 
    $("#location-filter").addEventListener("change", (e) => {
        e.preventDefault
        $("#location-filter").value
        $("#seniority-filter").disabled = true
        $("#category-filter").disabled = true
        filterFetch(getParams("location", "#location-filter"))
    }) 
    $("#category-filter").addEventListener("change", (e) => {
        e.preventDefault
        $("#category-filter").value
        $("#seniority-filter").disabled = true
        $("#location-filter").disabled = true
        filterFetch(getParams("category", "#category-filter"))
    }) 
    $("#seniority-filter").addEventListener("change", (e) => {
        e.preventDefault
        $("#seniority-filter").value
        $("#location-filter").disabled = true
        $("#category-filter").disabled = true
        filterFetch(getParams("seniority", "#seniority-filter"))
    }) 

    //input only accepts numbers
    $("#salary").addEventListener("input", (e) => {
        const value = e.target.valueAsNumber
        if (isNaN(value)) {
            $("#salary").value = ""
        }
    })
}
        

    

window.addEventListener("load", initializaApp()) 
    

