import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory } from 'react-router-dom';
import constants from '../../../../../constants';
import axios from 'axios';
import Auxilary from '../../../../../hoc/Auxilary';
import Loader from '../../../../Loader/Loader';
import Select from 'react-select';

export default function MedicalRecordsModal(props) {
  const [file, setFile] = useState({ preview: '', raw: '' });
  const [fileName,setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(props.isOpen);
  const history = useHistory();

  axios.defaults.withCredentials = true;

  useEffect(() => {}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', fileName);
    formData.append('file', file.raw);
    const config = { headers: { 'content-type': 'multipart/form-data' } };
    console.log(formData);
    
    setLoading(true);
    await axios
      .post(`${constants.API_URL}/add-medical-record`, formData, config)
      .then((res) => {
        console.log(res.data);
        
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
        props.onClose();
      });
  };

  const handleFile = (e) => {
    if (e.target.files.length) {
      setFile({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  return (
    <Auxilary>
      <Loader loading={loading} />
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={setOpen}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
          {/* <i
            class="far fa-edit"
            style={{ color: 'green', fontSize: '1.5rem', padding: '1%' }}
          ></i>{' '} */}
          {'Upload Medical Record'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <div className={``}>
              <div className="row">
                {/* <div className={`col-sm-12 pt-2`}> */}
                  <div className="col-sm-5">
                    <label>Name</label>
                    <input
                      type="text"
                      readonly
                      className="form-control"
                      placeholder="Name"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                    />
                  </div>
                  <div className="col-sm-7">
                    <div className="form-group">
                      <label>Choose File</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFile}
                      />
                    </div>
                  </div>

                  
                {/* </div> */}
              </div>
              <div classNames="row">
              <div className="col-sm mt-3 mb-3">
                    <div className="form-group">
                      <Button type="submit" variant="contained" color="primary">
                        Save
                      </Button>
                    </div>
                  </div>
              </div>
            </div>
          </form>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={props.onClose} color="primary" onClick={handleClick}>
            Go To Dashboard
          </Button>
        </DialogActions> */}
      </Dialog>
    </Auxilary>
  );
}
