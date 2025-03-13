import {use} from 'react'

const PatientPage = () => {
    useEffect(() => {
        console.log("✅ PatientPage mounted!");
      }, []);
  return (
    <div>
      <h1>PatientList</h1>
    </div>
  )
}

export default PatientPage
