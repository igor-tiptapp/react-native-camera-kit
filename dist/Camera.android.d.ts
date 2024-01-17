import React from 'react';
import { CameraProps } from './Camera';
declare const Camera: React.ForwardRefExoticComponent<Omit<CameraProps, "ref"> & React.RefAttributes<unknown>>;
export default Camera;
