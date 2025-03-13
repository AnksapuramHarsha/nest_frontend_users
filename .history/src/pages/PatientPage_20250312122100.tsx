import {useEffect} from 'react'

const PatientPage = () => {
    useEffect(() => {
        console.log("✅ PatientPage mounted!");
      }, []);
  return (
    <div className="pt-20">
      <h1>PatientList</h1>
    </div>
  )
}

export default PatientPage
