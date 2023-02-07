import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider({ value, setValue }) {
    // const [value, setValue] = React.useState(
    //     30,
    // );

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 100) {
            setValue(100);
        }
    };

    return (
        <div className='steps-container'>
            <Box>
                <label className='steps-label label'>Number of output</label>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Input
                            value={value}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 10,
                                min: 10,
                                max: 250,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={typeof value === 'number' ? value : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            min={1}
                            max={30}
                        />
                    </Grid>
                </Grid>
                <p className='steps-text'>Choose a number of output no more than 30</p>
            </Box>
        </div>
    );
}