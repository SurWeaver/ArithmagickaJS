//выдача целочисленного рандомного числа в определённом промежутке
function randomRange(min, max)
{
	return Math.floor(Math.random() * (max - min)) + min;
}
function numberSum(num)
{
	let sum = 0;
	while(num > 0)
	{
		sum += num % 10;
		num = ~~(num / 10);
	}
	return sum;
}

function createNewExample(op = ' ')
{
	let opChance = ['+', '-', '*', '/'];
	let num1 = 0, num2 = 0, result = 0;
	let divisibleNumbers = [];
	
	let operation;
	if (op == ' ') operation = opChance[randomRange(0, opChance.length)];//берём вероятность примера от игрока
	else operation = op;

	switch (operation)
	{//генерация примера
		case '+':
			num1 = randomRange(10, plusMinusLimit);//plusMinusLimit = 100;
			num2 = randomRange(10, plusMinusLimit);
			result = num1 + num2; break;
		case '-':
			num1 = randomRange(20, plusMinusLimit);
			num2 = randomRange(5, Math.max(15, num1 - 10));
			result = num1 - num2; break;
		case '*':
			num1 = randomRange(2, 10);//multipleLimit = 10;
			num2 = randomRange(2, multipleLimit);
			result = num1 * num2; break;
		case '/':
			do {
				divisibleNumbers.length = 0;
				num1 = randomRange(10, divideLimit);//divideLimit = 50
				for (let i = 2; i < num1 / 2; i++)
				{
					if (num1 % i == 0)
					{
						divisibleNumbers.push(i);
					}
				}

			} while (divisibleNumbers.length == 0);
			num2 = divisibleNumbers[randomRange(0, divisibleNumbers.length)];
			result = num1 / num2; break;
	}
	return [num1, operation, num2, result];
}


//Столкновения. Если всё норм, в конце уберу. Если сейчас не убрано и проект готов, значит я уже забыл.
function isRectsColliding(rec1, rec2)
{
	return (rec1.x < rec2.x + rec2.width &&
		rec1.x + rec1.width > rec2.x &&
		rec1.y < rec2.y + rec2.height &&
		rec1.height + rec1.y > rec2.y);
}
function isCirclesColliding(c1, c2)
{
	let dist = distanceBetweenPoints(c1, c2);
	return (dist < c1.radius + c2.radius);
}

function drawBar(variable, maxValue, backgroundColor, foregroundColor, x, y, width, height)
{
	ctx.fillStyle = backgroundColor;//'red';
	ctx.fillRect(x, y, width, height);//фон полоски здоровья
	ctx.fillStyle = foregroundColor;//'green';
	ctx.fillRect(x, y, variable / maxValue * width, height);//полоска здоровья
}

function drawVerticalBar(variable, maxValue, backgroundColor, foregroundColor, x, y, width, height)
{
	ctx.fillStyle = backgroundColor;//'red';
	ctx.fillRect(x, y, width, height);//фон полоски здоровья
	ctx.fillStyle = foregroundColor;//'green';
	ctx.fillRect(x, y, width, variable / maxValue * height);//полоска здоровья
}

function drawArcBar(variable, maxValue, backgroundColor, foregroundColor, x, y, radius, width, startAngle, endAngle)
{
	ctx.beginPath();
	let str = ctx.strokeStyle;
	let wid = ctx.lineWidth;
	ctx.lineWidth = width;
	ctx.strokeStyle = backgroundColor;
	ctx.arc(x, y, radius, startAngle, endAngle);
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.strokeStyle = foregroundColor;
	ctx.arc(x, y, radius, startAngle, startAngle + (endAngle - startAngle) / maxValue*variable);
	ctx.stroke();
	ctx.strokeStyle = str;
	ctx.lineWidth = wid;
	ctx.closePath();
}

function drawNumber(obj)
{//beginPath и closePath не используются, так как уже применяются внутри других прорисовок(а именно игрок и враги)
	ctx.textAlign = 'center';
	ctx.Baseline = 'middle';
	let x, y;//на случай, если из объекта брать только число, а координаты задавать самим
	if (arguments.length == 3)
	{
		x = arguments[1];
		y = arguments[2];
	}
	ctx.fillStyle = 'white';
	if (arguments.length == 1)
		{ ctx.fillRect(obj.x - 45, obj.y - obj.sprite.height - 40, 90, 25); }
	else if (arguments.length == 3)
		{ ctx.fillRect(x - 45, y - obj.sprite.height - 40, 90, 25); }
	ctx.fillStyle = 'black';
	
	ctx.font = "24px Consolas";
	if (arguments.length == 1)
		{ ctx.fillText(obj.number, obj.x, obj.y - obj.sprite.height - 25); }
	else if (arguments.length == 3)
		{ ctx.fillText(obj.number, x, y - obj.sprite.height - 25); }
}

function deltaTiming()
{
	deltaTime = performance.now() - prevTime;
	prevTime = performance.now();
}