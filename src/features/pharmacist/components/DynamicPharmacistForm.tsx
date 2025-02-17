import dynamic from 'next/dynamic';

const DynamicPharmacistForm = dynamic(() => import('./PharmacistForm'), {
  loading: () => <p>Loading...</p>,
});

export default DynamicPharmacistForm;
