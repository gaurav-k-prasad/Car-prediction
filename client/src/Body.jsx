import { useState } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid, FormHelperText } from '@mui/material';

const App = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    fuelType: '',
    doors: '',
    engineSize: '',
    transmission: '',
    mileage: '',
    ownerCount: '',
  });

  const [errors, setErrors] = useState({
    brand: false,
    model: false,
    year: false,
    fuelType: false,
    doors: false,
    engineSize: false,
    transmission: false,
    mileage: false,
    ownerCount: false,
  });

  const [predictedPrice, setPredictedPrice] = useState(0);

  const brands = ['Kia', 'Chevrolet', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota', 'Honda', 'BMW', 'Hyundai', 'Ford'];
  const models = ['Rio', 'Malibu', 'GLA', 'Q5', 'Golf', 'Camry', 'Civic', 'Sportage', 'RAV4', '5 Series', 'CR-V', 'Elantra', 'Tiguan', 'Equinox', 'Explorer', 'A3', '3 Series', 'Tucson', 'Passat', 'Impala', 'Corolla', 'Optima', 'Fiesta', 'A4', 'Focus', 'E-Class', 'Sonata', 'C-Class', 'X5', 'Accord'];
  const fuelTypes = ['Diesel', 'Hybrid', 'Electric', 'Petrol'];
  const doorsOptions = [2, 3, 4, 5];
  const transmissions = ['Automatic', 'Manual'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (value === '') {
      setErrors({
        ...errors,
        [name]: true,
      });
    } else {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formHasErrors = false;
    let newErrors = { ...errors };

    for (let key in formData) {
      if (formData[key] === '') {
        formHasErrors = true;
        newErrors[key] = true;
      }
    }

    if (formData.year < 2000 || formData.year > 2023) {
      formHasErrors = true;
      newErrors.year = true;
    }

    if (formData.doors < 2 || formData.doors > 5) {
      formHasErrors = true;
      newErrors.doors = true;
    }

    if (formData.engineSize <= 0) {
      formHasErrors = true;
      newErrors.engineSize = true;
    }

    if (formData.mileage <= 0) {
      formHasErrors = true;
      newErrors.mileage = true;
    }

    if (formData.ownerCount < 0) {
      formHasErrors = true;
      newErrors.ownerCount = true;
    }

    setErrors(newErrors);

    if (!formHasErrors) {
      const requestData = {
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        engineSize: parseFloat(formData.engineSize),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        mileage: parseFloat(formData.mileage),
        doors: parseInt(formData.doors),
        ownerCount: parseInt(formData.ownerCount),
      };

      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log(data);
      setPredictedPrice(data.predicted_price);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth required error={errors.brand}>
            <InputLabel>Brand</InputLabel>
            <Select
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              label="Brand"
            >
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
            {errors.brand && <FormHelperText>Brand is required</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required error={errors.model}>
            <InputLabel>Model</InputLabel>
            <Select
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              label="Model"
            >
              {models.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
            {errors.model && <FormHelperText>Model is required</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Year"
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
            error={errors.year}
            helperText={errors.year ? 'Year must be between 2000 and 2023' : ''}
            inputProps={{ min: 2000, max: 2023 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Engine Size (L)"
            type="number"
            name="engineSize"
            value={formData.engineSize}
            onChange={handleInputChange}
            required
            error={errors.engineSize}
            helperText={errors.engineSize ? 'Engine size must be a positive value' : ''}
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required error={errors.fuelType}>
            <InputLabel>Fuel Type</InputLabel>
            <Select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              label="Fuel Type"
            >
              {fuelTypes.map((fuel) => (
                <MenuItem key={fuel} value={fuel}>
                  {fuel}
                </MenuItem>
              ))}
            </Select>
            {errors.fuelType && <FormHelperText>Fuel Type is required</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required error={errors.transmission}>
            <InputLabel>Transmission</InputLabel>
            <Select
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
              label="Transmission"
            >
              {transmissions.map((transmission) => (
                <MenuItem key={transmission} value={transmission}>
                  {transmission}
                </MenuItem>
              ))}
            </Select>
            {errors.transmission && <FormHelperText>Transmission is required</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mileage"
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleInputChange}
            required
            error={errors.mileage}
            helperText={errors.mileage ? 'Mileage must be a positive number' : ''}
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Number of Owners"
            type="number"
            name="ownerCount"
            value={formData.ownerCount}
            onChange={handleInputChange}
            required
            error={errors.ownerCount}
            helperText={errors.ownerCount ? 'Owner count must be a non-negative number' : ''}
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required error={errors.doors}>
            <InputLabel>Doors</InputLabel>
            <Select
              name="doors"
              value={formData.doors}
              onChange={handleInputChange}
              label="Doors"
            >
              {doorsOptions.map((door) => (
                <MenuItem key={door} value={door}>
                  {door}
                </MenuItem>
              ))}
            </Select>
            {errors.doors && <FormHelperText>Doors must be between 2 and 5</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Grid>
      </Grid>

      {predictedPrice > 0 && <h3>Predicted Price: ${predictedPrice}</h3>}
    </form>
  );
};

export default App;
