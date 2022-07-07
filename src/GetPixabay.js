import axios from "axios";

const APIKEY = '28236906-ec88adbb20ef0e8befac5029d';

axios.defaults.baseURL = "https://pixabay.com/api/"

export class GetPixabayApi { 
    
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    };

    async fetchImages() { 
        const params = new URLSearchParams({
            key: APIKEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: 40,
        });
        
        const { data } = await axios.get(`?${params}`);
    this.incrementPage();
    return data;
    };
    get searchQueryReq() {
        return this.searchQuery
    };
    set searchQueryReq(newSearchQuery) {
        this.searchQuery = newSearchQuery
    };

    incrementPage() { 
        this.page += 1;
    };

    resetPage() { 
        this.page = 1;
    };
}

