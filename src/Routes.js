import React from "react";
import { Routes, Route } from "react-router-dom";
import {
BookingCreate, BookingEdit, BookingView, 
Bookings, 
PropertyCreate, PropertyEdit, PropertyView, 
PropertyTiles
} from "screens";

const Component = (props) => {

    return (
        <Routes>
            

                        
                                                        <Route path="Bookings/view/:id" element={<BookingView {...props} title={'View Booking'} />} />
                        <Route path="Bookings/edit/:id" element={<BookingEdit {...props} title={'Edit Booking'} />} />
                        <Route path="Bookings/create" element={<BookingCreate {...props} title={'Create Booking'} />} />
                                                <Route path="/" element={<Bookings {...props} title={'B Table'} nolistbar={true} />} />
                                                                    <Route path="Properties/view/:id" element={<PropertyView {...props} title={'View Property'} />} />
                        <Route path="Properties/edit/:id" element={<PropertyEdit {...props} title={'Edit Property'} />} />
                        <Route path="Properties/create" element={<PropertyCreate {...props} title={'Create Property'} />} />

                <Route path="/b_table" element={<Bookings {...props} title={'B Table'} />} />
                                                                                                                                                                                                                <Route path="/p_tiles" element={<PropertyTiles {...props} title={'P Tiles'} />} />
        </Routes>
    )

};

export default Component;