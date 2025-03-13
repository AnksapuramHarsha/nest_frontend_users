import React from 'react'

const PatientList = () => {
    const [createPatient, setCreatePatient] = React.useState<>(false)

    return (
        <div>
            <div className='flex justify-between items-center'>
                <div>
                    <input type="text" placeholder="Search by name" className="w-full p-2 border border-gray-300 rounded"/>
                </div>
                <div>
                    <button>
                        Create Patient
                    </button>
                </div>
            </div>



        </div>
    )
}

export default PatientList
