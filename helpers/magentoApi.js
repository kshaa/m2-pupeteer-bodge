const axios = require("axios");

/**
 * Magento 2 API
 * 
 * Functionality:
 * - token generation using admin credentials
 * - customer registration
 */
class MagentoApi {
    constructor ({baseUrl, adminUser, adminPass}) {
        // This Url parsing magic is bad, I should just import a Url manipulation library
         // Url with an obligatory slash at end
        this.baseUrl = baseUrl + (baseUrl[baseUrl.length-1] == '/' ? '' : '/');
        this.adminUser = adminUser;
        this.adminPass = adminPass;
    }
    getMagentoApi() {
        return axios.create({
            baseURL: this.baseUrl + 'rest/V1'
        });
    }
    async getAdminToken() {
        const apiInstance = this.getMagentoApi()
        const adminTokenResponse = await apiInstance.post('/integration/admin/token', {
            username: this.adminUser,
            password: this.adminPass
        });

        return adminTokenResponse.data;
    }
    /**
     * Register a new M2 customer
     */
    async registerCustomer(customerData, password) {
        const apiInstance = this.getMagentoApi();
        const adminToken = await this.getAdminToken();
        const customerPayload = {
            customer: customerData,
            password
        };

        // Authorize as a bear, because the API has a thing for bears for some reason
        apiInstance.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
        return apiInstance.post('/customers', customerPayload);
    }
    /**
     * Get info about an existing M2 customer by email
     */
    async getCustomersByEmail(email) {
        const apiInstance = this.getMagentoApi();
        const adminToken = await this.getAdminToken();
        const searchCriteria = {
            'searchCriteria[filter_groups][0][filters][0][field]': 'email',
            'searchCriteria[filter_groups][0][filters][0][value]': email
        };

        // Authorize as a bear, because the API has a thing for bears for some reason
        apiInstance.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
        const customerResponse = await apiInstance.get('/customers/search', {params: searchCriteria});

        return customerResponse.data.items;
    }
    async getFirstCustomerByEmail(email) {
        const customersByEmail = await this.getCustomersByEmail(email);

        return customersByEmail.length == 0 ? false : customersByEmail[0];
    }
    /**
     * Remove an existing M2 customer by email
     */
    async removeCustomerByEmail(email) {
        const apiInstance = this.getMagentoApi();
        const adminToken = await this.getAdminToken();
        const customer = await this.getFirstCustomerByEmail(email);

        if (!customer) return false;
        const customerId = customer.id;

        // Authorize as a bear, because the API has a thing for bears for some reason
        apiInstance.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;

        return apiInstance.delete(`/customers/${customerId}`);
    }
}

module.exports.create = (data) => new MagentoApi(data);