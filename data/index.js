class Cell {

	constructor(width, height, zoom) {
		this.RECT_HEIGHT = 143;
		this.RECT_LOC_X = 64;
		this.RECT_LOC_Y = 41;
		this.state = 0;
		this.width = width;
		this.height = height;
		this.zoom = zoom;
		this.balancing = false;
		this.draw = SVG().size(this.width, this.height);
		this.outline = this.draw.path('M 370.00,167.00 C 370.00,167.00 375.00,167.00 375.00,167.00 387.50,166.75 394.00,160.00 394.00,146.50 394.00,146.50 393.75,78.25 393.75,78.25 393.56,63.00 389.93,58.07 375.00,58.00 375.00,58.00 370.00,58.00 370.00,58.00 370.00,58.00 370.00,37.00 370.00,37.00 369.96,13.09 353.69,1.27 331.00,1.00 331.00,1.00 236.00,1.00 236.00,1.00 236.00,1.00 66.00,1.00 66.00,1.00 43.43,1.04 25.04,11.12 25.00,36.00 25.00,36.00 25.00,189.00 25.00,189.00 25.03,209.15 38.85,222.97 59.00,223.00 59.00,223.00 111.00,223.00 111.00,223.00 111.00,223.00 336.00,223.00 336.00,223.00 340.92,222.99 343.25,223.05 348.00,221.29 373.59,211.83 370.00,188.71 370.00,167.00 Z');
		this.outline.attr({
			fill: '#000000'
		});
		this.inline = this.draw.path('M 60.31,35.60 C 65.28,34.40 82.75,35.00 89.00,35.00 89.00,35.00 146.00,35.00 146.00,35.00 146.00,35.00 328.00,35.00 328.00,35.00 330.30,35.00 334.41,34.62 335.98,36.60 337.23,38.19 337.00,42.01 337.00,44.00 337.00,44.00 337.00,69.00 337.00,69.00 337.00,69.00 337.00,181.00 337.00,181.00 337.00,182.99 337.23,186.81 335.98,188.40 334.63,190.10 331.95,189.96 330.00,190.00 330.00,190.00 311.00,190.00 311.00,190.00 311.00,190.00 226.00,190.00 226.00,190.00 226.00,190.00 67.00,190.00 67.00,190.00 65.01,190.00 61.19,190.23 59.60,188.98 57.07,186.97 58.00,173.58 58.00,170.00 58.00,170.00 58.00,109.00 58.00,109.00 58.00,109.00 58.00,55.00 58.00,55.00 58.00,51.91 57.61,39.34 58.60,37.31 59.34,35.80 59.56,36.24 60.31,35.60 Z');
		this.inline.attr({
			fill: '#ffffff',
			'fill-opacity': 1.0
		});
		this.rect = this.draw.rect({
			width: 0,
			height: this.RECT_HEIGHT
		});
		this.rect.move(this.RECT_LOC_X, this.RECT_LOC_Y);
		this.rect.attr({
			fill: 'green',
			'fill-opacity': 1.0
		});
		this.rect.radius(4);
		this.text = this.draw.text('---mV');
		this.text.move(14 * this.zoom, (this.height - 10) * this.zoom).font({
			fill: '#000000',
			size: 76,
			family: 'monospace'
		})
		this.draw.viewbox({
			x: 0,
			y: 0,
			width: this.width * this.zoom,
			height: this.height * this.zoom
		})
	}

	getDrawing() {
		return this.draw;
	}

	setStateContinuous(width) {
		let r = parseInt(0xaa * (267 - width) / 267);
		let g = parseInt(0xaa - r);
		r = r.toString(16);
		g = g.toString(16);
		r = r.length == 1 ? '0' + r : r;
		g = g.length == 1 ? '0' + g : g;
		this.rect.attr({
			fill: '#' + r + g + '00',
			'fill-opacity': 1.0
		});
		this.rect.size(width, this.RECT_HEIGHT);
	}

	setVoltage(cellV, battV, remPerc) {
		if (cellV > 3400 && cellV < 4300) {
			let cellVRel = cellV - 3400;
			let battCellVRel = (battV / 14) - 3400;
			this.setStateContinuous(parseInt(267 * remPerc * cellVRel / battCellVRel / 100));
			this.text.tspan(cellV + 'mV');
		}
	}

	setBalancing(balancing) {
		if (this.balancing != balancing) {
			if (balancing) {
				this.outline.animate(480, 480, 'now').attr({
					fill: '#806ef1'
				}).loop(true, true);
			} else {
				this.outline.timeline().stop();
			}
		}
		this.balancing = balancing;
	}

}

function q(cells) {
	$.ajax({
		url: '/b',
		type: 'GET',
		dataType: 'json',
		success: function (data) {
			let voltage = data[0] / 100;
			let battV = data[0] * 10;
			let remPerc = data[12];
			let current = ((data[1] > 0x7FFF) ? -((0xffff - data[1]) / 100) : (data[1] / 100));
			let power = voltage * current;
			let remcapacity = data[2] / 100;
			let nomcapacity = data[3] / 100;
			let cycles = data[4];
			let cellbalance = data[6].toString(2);
			let temp0 = ((data[16] - 2731) / 10).toFixed(1);
			let temp1 = ((data[17] - 2731) / 10).toFixed(1);
			$.ajax({
				url: '/v',
				type: 'GET',
				dataType: 'json',
				success: function (datav) {
					let lowest = datav.reduce((prev, curr) => {
						return prev < curr ? prev : curr;
					});
					let highest = datav.reduce((prev, curr) => {
						return prev > curr ? prev : curr;
					});
					for (let x = 0; x < datav.length; x++) {
						cells[x].setVoltage(datav[x], battV, remPerc);
					}
					$('.summary').html('<span>Battery Voltage : ' +
						voltage.toFixed(2) + 'V</span><br /><span>Current : ' +
						current.toFixed(2) + 'A</span><br /><span>Power : ' +
						power.toFixed(2) + 'W</span><br /><span>Remaining Capacity : ' +
						remcapacity.toFixed(2) + 'Ah (' + remPerc + '%)</span><br /><span>Nominal Capacity : ' +
						nomcapacity.toFixed(2) + 'Ah</span><br /><span>Cycles : ' +
						cycles + '</span><br /><span>Temperature 0 : ' +
						temp0 + '&deg;C</span><br /><span>Temperature 1 : ' +
						temp1 + '&deg;C</span><br /><span>Cell Deviation : ' +
						(highest - lowest) + 'mV</span>');
				},
				error: function (xhr, opts, err) {
					console.error(err);
				}
			});
			let x = 0;
			while ((x < cells.length)) {
				cells[x].setBalancing(cellbalance & (0b1 << x));
				x++;
			}
			setTimeout(function () {
				q(cells)
			}, 1200);
		},
		error: function (xhr, opts, err) {
			setTimeout(function () {
				q(cells);
			}, 1200);
		}
	});
}

$(document).ready(function () {
	let cells = [];
	let x = 14;
	while (x-- > 0) {
		let cell = new Cell(80, 70, 5);
		cells.push(cell);
		cell.getDrawing().addTo('cells');
	}
	setTimeout(function () {
		q(cells);
	}, 0);
});