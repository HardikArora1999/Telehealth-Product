import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import '../MedicalRecords/MedicalRecords.css';
import Auxilary from '../../../../../hoc/Auxilary';
import MedicalRecordsModal from './MedicalRecordsModal';
import Loader from '../../../../Loader/Loader';
import axios from 'axios';
import constants from '../../../../../constants';

const MedicalRecords = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [MedicalRecordsData, setmedicalRecordsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recordChangeFlag,setRecordChangeFlag] = useState(false);

  const openModal = () => {
    console.log('opening modal...');
    console.log(showModal);
    setModalState((prev) => !prev);
  };
  const handleClose = () => {
    setModalState(false);
    setRecordChangeFlag((prev) => !prev);
  };

  useEffect(() => {
    const fetchMedicalRecords = async () =>{
      setLoading(true);
      await axios
      .get(`${constants.API_URL}/medical-records`)
      .then((res) => {
        setmedicalRecordsData(res.data.results);
        console.log(res.data.results);
      })
      .catch((e) => {
        console.log(e);
        setmedicalRecordsData([]);
      })
      .finally(() => {
        setLoading(false);
      });
    }
    fetchMedicalRecords();
  }, [recordChangeFlag])

  const reportLinkHandler = (file) =>{
    window.open(file);
  }

  const deleteHandler = async (id) => {
    await axios.delete(`${constants.API_URL}/delete-medical-record?medical_record_id=${id}`)
    .then(res=>{
      setRecordChangeFlag((prev) => !prev);
    })
    .catch(res=>{

    })
  }

  return (
    <Auxilary>
      <Loader loading={loading} />
      <div class="medical-records">
        <div class="medical-records-list">
          <div class="container mt-2">
            <div class="row">
              <div class="col-md-12">
                <div class="d-flex justify-content-between align-items-center activity">
                  Medical Records
                </div>
                <hr/>
                <div class="mt-3">
                  <ul class="list list-inline">
                    { MedicalRecordsData.map(record =>(
                      <li
                      class="d-flex justify-content-between hoverlist"
                      style={{
                        width: '50rem',
                          // cursor: "pointer",
                        //   boxShadow:
                        //     "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 5px 20px 0 rgba(0, 0, 0, 0.19)",
                      }}
                      key={record.id}
                    >
                      <div
                        class="d-flex flex-row align-items-center"
                        style={{
                          justifyContent: 'space-between',
                          width: '33%',
                        }}
                      >
                        <i
                          class="fa fa-check-circle checkicon"
                          style={{ marginLeft: '6%' }}
                        ></i>
                        <div class="ml-2">
                          <h6 class="mb-0">{record.name}</h6>
                          <div class="d-flex flex-row mt-1 text-black-50 date-time">
                            <div>
                              <i class="fa fa-calendar-o"></i>
                              <span class="ml-2">22 May 2020 11:30 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="d-flex flex-row align-items-center">
                        <div class="d-flex flex-column">
                        <button
                              type="button"
                              class="btn btn-primary btn-sm"
                              onClick={() => reportLinkHandler(record.file)}
                            >
                              Report
                            </button>
                        </div>{' '}
                        <Button
                        onClick={()=>deleteHandler(record.id)}>
                        <i
                          class="fas fa-prescription-bottle-alt"
                          style={{ fontSize: '1.5rem' }}
                        ></i></Button>
                      </div>
                    </li>
                    ))}

                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="upload-btn" style={{marginLeft:"1%"}}>
          <Button
            variant="contained"
            color="primary"
            style={{ fontSize: '60%' }}
            onClick={openModal}
          >
            Upload Medical Records
          </Button>
          
        </div>
      {modalState ? (
        <MedicalRecordsModal isOpen={true} onClose={handleClose} />
      ) : null}
    </Auxilary>
  );
};

export default MedicalRecords;
