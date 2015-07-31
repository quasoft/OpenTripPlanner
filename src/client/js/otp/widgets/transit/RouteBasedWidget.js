/* This program is free software: you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public License
   as published by the Free Software Foundation, either version 3 of
   the License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

otp.namespace("otp.widgets.transit");

otp.widgets.transit.RouteBasedWidget =
    otp.Class(otp.widgets.Widget, {

    module : null,

    agency_id : null,

    activeLeg : null,
    timeIndex : null,

    routeLookup : [], // for retrieving route obj from numerical index in <select> element

    lastSize : null,
    //variantIndexLookup : null,

    initialize : function(id, module, options) {

        otp.widgets.Widget.prototype.initialize.call(this, id, module, options);

        this.module = module;

        var this_ = this;

        var routeSelectDiv = $('<div class="otp-tripViewer-select notDraggable" />').appendTo(this.mainDiv);
        //TRANSLATORS: Public transit Route: routename (Used in Trip viewer)
        $('<div style="float: left;">' + _tr('Route:') + '</div>').appendTo(routeSelectDiv);
        this.routeSelect = $('<select id="'+this.id+'-routeSelect" style="width:100%;"></select>')
        .appendTo($('<div style="margin-left:60px;">').appendTo(routeSelectDiv))
        .change(function() {
            this_.newRouteSelected();
        });

        _.each(module.webapp.indexApi.routes, function(route, key) {
            var optionHtml = '<option>';
            //if(route.routeData.shortName) optionHtml += '('+route.routeData.shortName+') ';
            if(route.routeData.longName) optionHtml += route.routeData.longName;
            optionHtml += '</option>';
            this_.routeSelect.append($(optionHtml));
            this_.routeLookup.push(route);
        });


        var variantSelectDiv = $('<div class="otp-tripViewer-select notDraggable" />').appendTo(this.mainDiv);
        //TRANSLATORS: Public Transit Route variant: Start - end stop (Used in
        //trip viewer)
        $('<div style="float: left;">' + _tr('Variant:') + '</div>').appendTo(variantSelectDiv);
        this.variantSelect = $('<select id="'+this.id+'-variantSelect" style="width:100%;"></select>')
        .appendTo($('<div style="margin-left:60px;">').appendTo(variantSelectDiv))
        .change(function() {
            this_.newVariantSelected();
        });

    },

    newRouteSelected : function() {
        this.agency_id = null;
        this.activeLeg = null;
        var route = this.routeLookup[this.routeSelect.prop("selectedIndex")]
        this.agency_id = route.routeData.id;
        this.variantSelect.empty();
        this.clear() //stopList.empty();
        this.checkAndLoadVariants();
    },

    newVariantSelected : function() {
        this.activeLeg = null;
        var variantId = this.variantSelect.val();
        //console.log("new variant selected: "+variantId);
        this.clear() //stopList.empty();
        this.setActiveVariant(this.module.webapp.indexApi.routes[this.agency_id].variants[variantId]);
    },

    update : function(leg) {
        //this.clearTimes();
        this.activeLeg = leg;
        this.activeTime = leg.startTime;
        //this.times = times;

        this.agency_id = leg.agencyId + ":" + leg.routeId;

        var tiRouteInfo = this.module.webapp.indexApi.routes[this.agency_id];
        $('#'+this.id+'-routeSelect option:eq('+tiRouteInfo.index+')').prop('selected', true);

        this.checkAndLoadVariants();
    },

    checkAndLoadVariants : function() {
        var tiRouteInfo = this.module.webapp.indexApi.routes[this.agency_id];
        if(tiRouteInfo.variants != null) {
            //console.log("variants exist");
            this.updateVariants();
        }
        else {
            this.module.webapp.indexApi.loadVariants(this.agency_id, this, this.updateVariants);
        }
    },

    updateVariants : function() {
        var this_ = this;
        var route = this.module.webapp.indexApi.routes[this.agency_id];

        if(!route.variants) {
            console.log("ERROR: indexApi.routes.["+this.agency_id+"].variants null in RouteBasedWidget.updateVariants()");
            return;
        }

        this.variantSelect.empty();
        _.each(route.variants, function(variant) {
            $('<option value='+ variant.id +'>'+variant.desc+'</option>').appendTo(this_.variantSelect);
        });

        if(this.activeLeg) {
            this.module.webapp.indexApi.readVariantForTrip(this.activeLeg.agencyId,  this.activeLeg.routeId, this.activeLeg.tripId, this, this.setActiveVariant);
        }


        if(!this.activeLeg) {
            this.newVariantSelected();
        }
    },

    setActiveVariant : function(variantData) {
        var this_ = this;
        var route = this.module.webapp.indexApi.routes[this.agency_id];
        this.activeVariant = route.variants[variantData.id];
        $('#'+this.id+'-variantSelect option:eq('+this.activeVariant.index+')').prop('selected', true);

        this.variantSelected(variantData);
    },

    // functions to be implemented by subclasses:

    clear : function() {
    },

    variantSelected : function() {
    },

});
