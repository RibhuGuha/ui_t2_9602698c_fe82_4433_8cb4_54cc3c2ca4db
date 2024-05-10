import Helper from "shared/helper";
import { apiUrl as serverApi } from "config";

const GetEntityInfo = async (name) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}${name}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}



 


	    
	 	
	
		
/* Bookings */

const GetBookingsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Bookings/$count`;
        if (query) url = `${serverApi}Bookings/$count?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetBookingsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Bookings`;
        if (query) url = `${serverApi}Bookings?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetBookingSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Bookings(${id})`;
        if (params) {
            url = `${serverApi}Bookings(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetBookingSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.BookingId;
        let method = "POST";
        let url = `${serverApi}Bookings`;
        if (input.BookingId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Bookings(${input.BookingId})`;
        } else if (input.BookingId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Bookings(${input.BookingId})`;
        }

        delete input['BookingId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.BookingId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
           
 	
     


/* Document */ 
const SetDocumentSingleMedia = async (input, headers) => {     return new Promise(async (resolve) => {
        let id = headers.DocId;
        let method = "POST";
        let url = `${serverApi}Documents`;
        if (headers.DocId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Documents(${headers.DocId})`;
        } else if (headers.DocId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Documents(${headers.DocId})`;
        }
        delete headers['DocId'];
        delete headers['Deleted'];

        const formData = new FormData();
        formData.append('file', input);

        try {
            const res = await fetch(url, {
                method, body: formData,
                headers: {
                    ...headers
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.DocId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
const GetDocumentSingleMedia = async (id, value, type) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}Documents(${id})`;
        if (value) {
            url = `${serverApi}Documents(${id})/$value`;
        }

        try {
            const res = await fetch(url, {
                method: "GET"
            });

            if (res.status === 200) {
                let data = null;
                if (value) {
                    data = await res.text();
                    if (!Helper.IsNullValue(data)) {
                        if (data.startsWith("data:")) {
                            data = data.substring(data.indexOf('data:'));
                        } else {
                            let tmp = data.split('\r\n');
                            for (let img of tmp) {
                                if (img.startsWith("data:")) data = img;
                            }
                        }
                    }
                    return resolve({ status: res.ok, values: data });
                }
                data = await res.json();
                return resolve({ status: res.ok, values: data });
            }
            return resolve({ status: false, statusText: "Failed fetching data" });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

     
	        	
	
	
	    
	 	
	
		
/* Properties */

const GetPropertiesCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Properties/$count`;
        if (query) url = `${serverApi}Properties/$count?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetPropertiesMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Properties`;
        if (query) url = `${serverApi}Properties?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetPropertySingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Properties(${id})`;
        if (params) {
            url = `${serverApi}Properties(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetPropertySingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.PropId;
        let method = "POST";
        let url = `${serverApi}Properties`;
        if (input.PropId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Properties(${input.PropId})`;
        } else if (input.PropId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Properties(${input.PropId})`;
        }

        delete input['PropId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.PropId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   	   							// For Nested APIs
			/* $navPropName */
const SetPropertySecondImagesJoin = async (input) => {     return new Promise(async (resolve) => {
        let id = input.DocId;
        let method = "POST";
        let url = `${serverApi}Documents`;
        if (input.DocId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Documents(${id})`;
        } else if (input.DocId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Documents(${id})`;
        }

        delete input['DocId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.DocId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
const GetPropertySecondImagesJoin = async (id, filter) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}Documents(${id})`;
        if (filter) {
            url = `${serverApi}Documents?$filter=${filter}`;
        }

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		            // Collection type media type functions are same as collection type non-media type functions as they are just join tables
            	   							// For Nested APIs
			/* $navPropName */
const SetPropertyBookingsJoin = async (input) => {     return new Promise(async (resolve) => {
        let id = input.BookingId;
        let method = "POST";
        let url = `${serverApi}Bookings`;
        if (input.BookingId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Bookings(${id})`;
        } else if (input.BookingId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Bookings(${id})`;
        }

        delete input['BookingId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.BookingId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
const GetPropertyBookingsJoin = async (id, filter) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}Bookings(${id})`;
        if (filter) {
            url = `${serverApi}Bookings?$filter=${filter}`;
        }

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		            // Collection type media type functions are same as collection type non-media type functions as they are just join tables
            	   							// For Nested APIs
			/* $navPropName */
const SetPropertyThirdImagesJoin = async (input) => {     return new Promise(async (resolve) => {
        let id = input.DocId;
        let method = "POST";
        let url = `${serverApi}Documents`;
        if (input.DocId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Documents(${id})`;
        } else if (input.DocId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Documents(${id})`;
        }

        delete input['DocId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.DocId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
const GetPropertyThirdImagesJoin = async (id, filter) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}Documents(${id})`;
        if (filter) {
            url = `${serverApi}Documents?$filter=${filter}`;
        }

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		            // Collection type media type functions are same as collection type non-media type functions as they are just join tables
            		
	
 


// Below is a reference function - a possible business logic for ecom reference app
const GetProductStatus = async (productId) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductOnBoardings?$filter=ProductId eq ${productId}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                let _tmp = { Status: '' };
                if (json.value && json.value.length > 0) {
                    _tmp = json.value[0];
                }
                return resolve({ status: res.ok, values: _tmp });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}




const GetMetaData = async () => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}$metadata`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            if (res.status === 200) {
                const values = await res.text();
                return resolve({ status: res.ok, values });
            }

            return resolve({ status: false, statusText: "Failed fetching data" });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

/* Prodict List View Details */
const GetProductOnBoardings = async () => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductOnBoardings`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

export {
 GetEntityInfo,  GetBookingsCount, GetBookingsMulti, GetBookingSingle, SetBookingSingle, SetDocumentSingleMedia, GetDocumentSingleMedia, GetPropertiesCount, GetPropertiesMulti, GetPropertySingle, SetPropertySingle, SetPropertySecondImagesJoin, GetPropertySecondImagesJoin, SetPropertyBookingsJoin, GetPropertyBookingsJoin, SetPropertyThirdImagesJoin, GetPropertyThirdImagesJoin, GetProductStatus, GetMetaData, GetProductOnBoardings
};