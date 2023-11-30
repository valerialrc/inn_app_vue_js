const app = Vue.createApp({
  data(){
    return {
      searchText: '',
      selectedInnId: null,
      selectedRoomId: null,
      selectedCityId: null,
      selectedCityName: '',
      id: '',
      user_id: '',
      trade_name: '',
      phone: '',
      email: '',
      description: '',
      payment_method_id: '',
      accepts_pets: '',
      checkin_time: '',
      checkout_time: '',
      policies: '',
      active: '',
      average_rating: '',
      address_id: '',
      address_street: '',
      address_number: '', 
      address_district: '',
      address_state: '',
      address_city: '',
      address_cep: '',
      listInns: [],
      listRooms: [],
      roomData: null,
      availabilityMessage: null,
      reservationPrice: null,
      checkinDate: '',
      checkoutDate: '',
      guestsNumber: 1,
      error: null,
      listCities: [],
      listInnsByCity: [], 
    }
  },

  computed: {
    listResult() {
      this.resetDetails();
      this.resetRoomDetails();
      this.resetCheckAvailability();
      this.resetCityDetails();

      if (this.searchText) {
        return this.listInns.filter(inn => {
          return inn.trade_name.toLowerCase().includes(this.searchText.toLowerCase());
        });

      } else {
        return this.listInns;
      }
    }
  },
  
  async mounted() {
    await this.getCities();
    await this.getData();
  },

  methods:{
    async getData(){
      let response = await fetch('http://localhost:3000/api/v1/inns');
      
      let data = await response.json();

      this.listInns = [];

      data.forEach(item => {
        var inn = new Object();
        inn.id = item.id;
        inn.user_id = item.user_id;
        inn.trade_name = item.trade_name;
        inn.phone = item.phone;
        inn.email = item.email;
        inn.description = item.description;
        inn.payment_method_id = item.payment_method_id;
        inn.accepts_pets = item.accepts_pets;
        inn.checkin_time = item.checkin_time;
        inn.checkout_time = item.checkout_time;
        inn.policies = item.policies;
        inn.active = item.active;
        inn.average_rating = item.average_rating;
    
        // Address
        inn.address_id = item.address.id;
        inn.address_street = item.address.street;
        inn.address_number = item.address.number;
        inn.address_district = item.address.district;
        inn.address_state = item.address.state;
        inn.address_city = item.address.city;
        inn.address_cep = item.address.cep;
    
        this.listInns.push(inn);
      });
    
    },

    async showInnDetails(id){
      this.selectedInnId = id;
      let response = await fetch(`http://localhost:3000/api/v1/inns/${id}`);

      let data = await response.json();

      this.id = data.id;
      this.user_id = data.user_id;
      this.trade_name = data.trade_name;
      this.phone = data.phone;
      this.email = data.email;
      this.description = data.description;
      this.payment_method_id = data.payment_method_id;
      this.accepts_pets = data.accepts_pets;
      this.checkin_time = data.checkin_time;
      this.checkout_time = data.checkout_time;
      this.policies = data.policies;
      this.active = data.active;
      this.average_rating = data.average_rating;
  
      // Address
      this.address_id = data.address.id;
      this.address_street = data.address.street;
      this.address_number = data.address.number;
      this.address_district = data.address.district;
      this.address_state = data.address.state;
      this.address_city = data.address.city;
      this.address_cep = data.address.cep;
        
      await this.getRoomsData();
    },

    resetDetails() {
      this.selectedInnId = null;

      // Limpa os detalhes da pousada
      this.id = '';
      this.user_id = '';
      this.trade_name = '';
      this.phone = '';
      this.email = '';
      this.description = '';
      this.payment_method_id = '';
      this.accepts_pets = '';
      this.checkin_time = '';
      this.checkout_time = '';
      this.policies = '';
      this.active = '';
      this.average_rating = '';

      // Limpa os detalhes do endereço
      this.address_id = '';
      this.address_street = '';
      this.address_number = '';
      this.address_district = '';
      this.address_state = '';
      this.address_city = '';
      this.address_cep = '';

      // Limpa os detalhes dos quartos
      this.listRooms = [];
    },

    async getRoomsData() {
      if (this.selectedInnId !== null) {
        let response = await fetch(`http://localhost:3000/api/v1/inns/${this.selectedInnId}/rooms`);

        this.listRooms = await response.json();
        this.roomData = this.listRooms;
      }
    },

    async showRoomDetails(roomId) {
      this.selectedRoomId = roomId;

      let response = await fetch(`http://localhost:3000/api/v1/inns/${this.selectedInnId}/rooms/${this.selectedRoomId}`);
    
      let roomData = await response.json();

      this.roomData = roomData
    },

    resetRoomDetails() {
      this.selectedRoomId = null;

      this.roomData = null;
    },

    async checkAvailability() {
      const checkinDate = this.checkinDate;
      const checkoutDate = this.checkoutDate;
      const guestsNumber = this.guestsNumber;

      let response = await fetch(`http://localhost:3000/api/v1/inns/${this.selectedInnId}/rooms/${this.selectedRoomId}/check_availability?checkin_date=${checkinDate}&checkout_date=${checkoutDate}&guests_number=${guestsNumber}`);
      let data = await response.json();

      this.availabilityMessage = data.message;
      this.reservationPrice = data.reservation_price;
      this.error = data.error;
    },

    resetCheckAvailability() {
      this.checkinDate = null;
      this.checkoutDate = null;
      this.guestsNumber = 1;
      this.availabilityMessage = null;
      this.reservationPrice = null;
      this.error = null;
    },

    async getCities() {
      let response = await fetch('http://localhost:3000/api/v1/cities');
      let data = await response.json();

      this.listCities = [];

      data.forEach(item => {
        var city = new Object();
        city.id = item.id;
        city.name = item.name;
  
        this.listCities.push(city);
      });
    },
  
    async getInnsByCity(cityId) {
      let response = await fetch(`http://localhost:3000/api/v1/cities/${cityId}`);
      let data = await response.json();

      this.listInnsByCity = [];

      data.forEach(item => {
        var inn = new Object();
        inn.id = item.id;
        inn.user_id = item.user_id;
        inn.trade_name = item.trade_name;
        inn.phone = item.phone;
        inn.email = item.email;
        inn.description = item.description;
        inn.payment_method_id = item.payment_method_id;
        inn.accepts_pets = item.accepts_pets;
        inn.checkin_time = item.checkin_time;
        inn.checkout_time = item.checkout_time;
        inn.policies = item.policies;
        inn.active = item.active;
        inn.average_rating = item.average_rating;
    
        // Address
        inn.address_id = item.address.id;
        inn.address_street = item.address.street;
        inn.address_number = item.address.number;
        inn.address_district = item.address.district;
        inn.address_state = item.address.state;
        inn.address_city = item.address.city;
        inn.address_cep = item.address.cep;
    
        this.listInnsByCity.push(inn);
      });
      console.log(this.selectedCityId)

    },
  
    async showInnsByCity(cityId) {
      this.selectedCityId = cityId;
      const selectedCity = this.listCities.find(city => city.id === cityId);
      this.selectedCityName = selectedCity ? selectedCity.name : '';
      
      await this.getInnsByCity(cityId);
    },

    resetCityDetails() {
      this.selectedCityId = null;
      this.selectedCityName = '';
      this.listInnsByCity = [];
    },

    toCurrency(price) {
      if (!isNaN(price)) {
        const formatted_price = parseFloat(price).toFixed(2);
        
        return formatted_price.replace('.', ',');
      } else {
        return price;
      }
    }
  }
})

app.mount('#inn-app');