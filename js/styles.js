/* Devloper: Tanish Bansal (tanish.sc@gmail.com) */
const okrs = (() => {
    var publicApis = {};
    var filterParentChildData = {};
    var parentData = {};
    var filterValue = "";
    var filterOkrKeys = ['Company', 'Sales', 'Marketing', 'Finance', 'People', 'Product Management', 'Engineering', 'Administration', 'Customer Success', 'Design'];

    /* INIT function used for Fetch the API and Display the Result */
    publicApis.init = () => {
        this.ajaxRequest('https://okrcentral.github.io/sample-okrs/db.json')
            .then(data => {
                this.filterParentChildObject(data);
                jQuery('.okr-container').html(this.renderOkrList());
                jQuery('.header-filter').html(this.options);
            }).catch(data => {
                alert(data);
            });
    };

    /* display the filtered Data */
    publicApis.filterPage = (event) => {
        filterValue = event.target.value;
        jQuery('.okr-container').html(this.renderOkrList());
    };

    publicApis.toggleChild = (event) => {
        jQuery(event).toggleClass('hide');
    };

    /* Render the ParentChildData */
    this.renderOkrList = () => {
        return `<ol type=1>${this.renderParentList()}</ol>`;
    };

    this.renderParentList = () => {
        let html = '';
        for(let key in filterParentChildData) {
            if (parentData[key] && (filterValue == '' || filterValue == parentData[key].category)) {
                html += `<div class="okr-data">
                            <span class="drop-down"><select class="select" onClick=okrs.toggleChild(${key})></select></span>
                            <span><li class="okr-parent-data">${parentData[key].title}</li>
                                <ol type="a" id=${key}>
                                    ${this.renderChildList(filterParentChildData[key])}
                                </ol>
                            </span>
                        </div>
                        `;
            }                    
        }
        return html;
    };

    this.renderChildList = (childObjs) => {
        let html = '';
        for(let obj of childObjs) {
            html += `<li class="card">${obj.title}</li>`;
        }
        return html;
    };

    /* This is a common Ajax call function for all [GET, POST, DELETE]*/
    this.ajaxRequest = (url, data = {}, type = 'GET') => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                data: data,
                type: type,
                success: (data) => {
                    resolve(data);
                },
                error: () => {
                    reject("Error in Fetching the data");
                }
            });
        });
    };

    this.filterParentChildObject = (data) => {
        for(let dataObj of data['data']) {
            if(dataObj.parent_objective_id == '') {
                parentData[dataObj.id] = dataObj;
            } else {
                if (filterParentChildData[dataObj.parent_objective_id]) {
                    filterParentChildData[dataObj.parent_objective_id].push(dataObj);
                } else {
                    filterParentChildData[dataObj.parent_objective_id] = [dataObj];
                }
                
            }
        }
    };

    this.options = () => {
        let options = `<option value="" disabled selected>Select Filter</option>`;
        for(let key of filterOkrKeys) {
            options += `<option value="${key}">${key}</option>`;
        }
        return options;
    };

    return publicApis;
})();

okrs.init();