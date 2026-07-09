/*


///--------------------------

create category -> amidn access
{
  "name": "Plumbing",
  "icon": "https://cdn-icons-png.flaticon.com/512/2966/2966481.png",
  "description": "Services related to water pipes, leaks, faucets, and drainage systems."
}

{
  "name": "Electrical",
  "icon": "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
  "description": "Electrical installation, repair, wiring, and maintenance services."
}


{
  "name": "Cleaning",
  "icon": "https://cdn-icons-png.flaticon.com/512/3082/3082037.png",
  "description": "Home, office, kitchen, bathroom, and deep cleaning services."
}

{
  "name": "Painting",
  "icon": "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
  "description": "Interior and exterior wall painting, polishing, and finishing."
}

{
  "name": "AC Repair",
  "icon": "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
  "description": "Air conditioner installation, servicing, gas refill, and repair."
}

///-------------------------------------

service 


///create sercice 

{
  "categoryId": "1f77e4f1-4f04-47d0-9308-aa5b8cc8e4f4",
  "title": "Bathroom Pipe Repair",
  "description": "Fix leaking pipes and replace damaged fittings.",
  "price": 500,
  "duration": 60
}


///--------- admin api 



///-------------- service get all post filter

http://localhost:5000/api/service

http://localhost:5000/api/service?searchTerm=pipe

http://localhost:5000/api/service?searchTerm=clean

http://localhost:5000/api/service?category=Plumbing

http://localhost:5000/api/service?category=Electrical

http://localhost:5000/api/service?location=Dhaka

http://localhost:5000/api/service?location=Chittagong

http://localhost:5000/api/service?priceMin=500

http://localhost:5000/api/service?priceMax=1500

http://localhost:5000/api/service?priceMin=500&priceMax=1500

http://localhost:5000/api/service?rating=4

http://localhost:5000/api/service?page=1&limit=10

http://localhost:5000/api/service?page=2&limit=5

http://localhost:5000/api/service?searchTerm=pipe&page=1&limit=10

http://localhost:5000/api/service?category=Plumbing&location=Dhaka

http://localhost:5000/api/service?category=Electrical&priceMin=300&priceMax=1000

http://localhost:5000/api/service?location=Dhaka&priceMin=500&priceMax=2000

http://localhost:5000/api/service?category=Cleaning&rating=4

http://localhost:5000/api/service?searchTerm=repair&category=Plumbing

http://localhost:5000/api/service?searchTerm=repair&category=Plumbing&location=Dhaka

http://localhost:5000/api/service?searchTerm=repair&category=Plumbing&location=Dhaka&priceMin=300&priceMax=1000

http://localhost:5000/api/service?searchTerm=repair&category=Plumbing&location=Dhaka&priceMin=300&priceMax=1000&rating=4

http://localhost:5000/api/service?searchTerm=repair&category=Plumbing&location=Dhaka&priceMin=300&priceMax=1000&rating=4&page=1&limit=10





*/