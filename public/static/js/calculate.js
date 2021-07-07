
/*
[{"type":"rectangle","area":"人头","area_id":"kt","latlngs":[{"lat":-1504,"lng":2196},{"lat":-924,"lng":2196},{"lat":-924,"lng":2656},{"lat":-1504,"lng":2656}]}]
latlngs：左下角坐标，左上角坐标，右上角，右下角
将标注的json转换为图像的绝对坐标
*/
function getVocData(jsonstr)
{
	var datas=[];
	var obj = JSON.parse(jsonstr);//由JSON字符串转换为JSON对象
	
	for(k=0;k<obj.length;k++){
		var data = {};
		var obj_latlngs_leftdown=obj[k].latlngs[0];
		var obj_latlngs_leftup=obj[k].latlngs[1];
		var obj_latlngs_rightup=obj[k].latlngs[2];
		var obj_latlngs_rightdown=obj[k].latlngs[3];
		

		var lng_width=Math.abs(obj_latlngs_rightup.lng-obj_latlngs_leftup.lng);
		var lat_height=Math.abs(obj_latlngs_rightdown.lat-obj_latlngs_leftup.lat);
		
		var xmin_point=Math.abs(obj_latlngs_leftup.lng);
		var ymin_point=Math.abs(obj_latlngs_leftup.lat);

		var box_px_width=lng_width;
		var box_px_height=lat_height;

		var xmax_point=xmin_point+box_px_width;
		var ymax_point=ymin_point+box_px_height;
		var info=xmin_point+","+ymin_point+";"+xmax_point+","+ymax_point;
		data["type"] = obj[k].type;
		data["area"] = obj[k].area;
		data["area_id"] = obj[k].area_id;
		data["xmin"] = xmin_point;
		data["ymin"] = ymin_point;
		data["xmax"] = xmax_point;
		data["ymax"] = ymax_point;
		datas.push(data);
	}//end for
	var jsonString = JSON.stringify(datas); 
	alert(jsonString);
}