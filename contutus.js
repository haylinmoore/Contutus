// Setup hash data

let _Contutus = {
    registered: [],
    register: function(instance){
        this.registered.push(instance);
        instance.routeTo(window.location.hash);
    }
}

window.addEventListener('hashchange', function(){
    for (let instance of _Contutus.registered){
        instance.routeTo(window.location.hash);
    }
}, false);

if (window.location.hash == "")
    window.location.hash = "/";

// Contutus class
class Contutus {
    element;
    routeTable = {

    }
    constructor(element) {
        this.element = element;
    }

    register(routes){
        for (let path in routes) {
            let routeData = routes[path];
            let pathSplit = path.split("/");
            pathSplit.shift();

            this.recursiveRouteInsert(pathSplit, routeData, this.routeTable);
        }
    }

    recursiveRouteInsert(pathSplit, routeData, routeTableLocation){
        if (pathSplit.length == 1){
            routeTableLocation[pathSplit[0]] = routeData;
        } else {
            if (routeTableLocation[pathSplit[0]] == undefined){
                routeTableLocation[pathSplit[0]] = {};
            }
            let newRouteTableLocation = routeTableLocation[pathSplit[0]];
            pathSplit.shift();
            this.recursiveRouteInsert(pathSplit, routeData, newRouteTableLocation);
        }
    }

    routeTo(path){
        let pathSplit = path.split("/");
        pathSplit.shift();

        let routeTableLocation = this.routeTable;
        let newView;
        let routeToRun;
        let current404 = routeTableLocation["$404$"];

        // lets find the route to run
        while (!routeToRun) {
            if (pathSplit.length == 1) {
                let currentRoute = routeTableLocation[pathSplit[0]];

                if (currentRoute == undefined) {
                    routeToRun = current404;
                    break;
                }

                if (!Array.isArray(currentRoute) && typeof currentRoute == "object"){
                    if (currentRoute[""]){
                        currentRoute = currentRoute[""];
                    } else {
                        routeToRun = current404;
                        break;
                    }
                }

                routeToRun = currentRoute;

                break;

            } else {
                let currentRoute = routeTableLocation[pathSplit[0]];

                if (currentRoute == undefined) {
                    routeToRun = current404;
                    break;
                }

                if (currentRoute["$404$"]){
                    current404 = currentRoute["$404$"];
                }

                pathSplit.shift();
            }
        }

        // Lets run routeToRun
        if (typeof routeToRun == "function")
            newView = routeToRun(path);

        if (Array.isArray(routeToRun))
            newView = routeToRun[0](path, routeToRun.slice(1));

        // Now lets set the new contents
        while(this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
        this.element.appendChild(newView);

    }

    _debug_element(){
        return this.element;
    }
}

console.log('Contutus has loaded :)');