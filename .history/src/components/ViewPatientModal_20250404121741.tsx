import React from 'react'

interface ViewPatientModalProps {
    upid: string;
    onClose: () => void;
  }

const ViewPatientModal: React.FC<ViewPatientModalProps> = ({upid}) => {
  return (
    <div>
        <h2>ViewPatientModal</h2>
    </div>
  )
}

export default ViewPatientModal
