function Enemy(name, power, hp)
{
	this.x = canvas.width + 60;//по вертикали никто не будет отличаться, Y не зачем
	this.y = canvas.height / 6 + 50;
	this.name = name;
	let chance = randomRange(0, 2);
	if (chance == 0)
	{
		sEnemy.src = "images\\enemy.png";
	}
	else
	{
		sEnemy.src = "images\\enemy1.png"
	}
	this.sprite = sEnemy;
	this.hp = hp;
	this.maxHP = hp;
	this.power = power;
	this.myExample = [];//здесь хранится [1 число, оператор, 2 число, результат]
	this.number = '';//то, что выводится
	this.result = 0;
	this.statusDuration = [];
	this.statusDuration['stun'] = 0;
	this.statusDuration['weak'] = 0;
	this.attack = function()
	{
		let damage = this.power;
		if (this.statusDuration['weak'] > 0)
		{
			this.statusDuration['weak']--;
			damage = ~~(damage / 2);
		}
		if (this.statusDuration['stun'] > 0)
		{
			this.statusDuration['stun']--;
			return;
		}
		if (Player.statusDuration['shield'] > 0)
		{
			Player.statusDuration['shield']--;
			if (Player.statusDuration['shield'] == 0)//прорисовка проламывания щита
			{
				shieldBreakSound.play();
				for (let i = 0; i < 5; i++)
				{
					let angle = (72*i - 30) * Math.PI / 180;
					partSys.addSprite(Player.x - sPlayer.width/2, Player.y - sPlayer.height, sShieldParts[i], Math.cos(angle) * 3, Math.sin(angle) * 3, 0.5);
				}
			}
			damage = ~~(damage / 2);
		}
		Player.hp -= damage;//вычитается только половина урона, если враг ослаблен. Ещё половина, если у игрока щит
		if (Player. hp > 0) playerDamagedSound.play();
		else deathSound.play();
		partSys.addText(Player.x, Player.y, damage, 'red', 'black', 3);
	}
}

let PlayerInstance = function()
{
	this.x = canvas.width / 3;
	this.y = canvas.height / 6 + 50;
	this.dY = 0;
	this.sprite = sPlayer;
	this.xp = 0;
	this.maxXP = 50;
	this.level = 1;
	this.points = 0;
	this.correctAnswers = 0;
	this.mistakes = 0;
	this.corPlus = 0;
	this.corMinus = 0;
	this.corMultiply = 0;
	this.corDivide = 0;
	this.frags = 0;
	this.hp = 100;
	this.maxHP = 100;
	this.damage = 3;
	this.timerSize = 20;
	this.pressedGo = false;
	this.statusDuration = [];
	this.statusDuration['shield'] = 0;
	this.statusDuration['extraXP'] = 0;
	this.statusDuration[' Damage'] = 0;
	this.statusDuration['+Damage'] = 0;
	this.statusDuration['-Damage'] = 0;
	this.statusDuration['*Damage'] = 0;
	this.statusDuration['/Damage'] = 0;
	this.number = 0;
	this.levelUp = function()
	{
		if (this.xp >= this.maxXP)
		{
			if (mode == 'game')
			{
				levelUpSound.play();
				partSys.addText(this.x, this.y, 'УРОВЕНЬ ПОВЫШЕН', 'yellow', 'white', 3);
			}
			this.level++;
			this.timerSize += 0.5;
			this.xp -= this.maxXP;
			this.maxXP += this.maxXP;
			plusMinusLimit += 10;
			multipleLimit += 2;
			divideLimit += 5;
			this.maxHP += 10;
			this.hp = this.maxHP;
			this.damage++;
		}
	};
};

let Example = function(x, y, operator = ' ')
{
	this.x = x;
	this.y = y;
	this.example;
	this.result;
	this.number;
	this.operator;
	this.effect;
	this.renewExample = function(operator = ' ')
	{
		this.example = createNewExample(operator);
		this.result = this.example[3];
		this.number = this.example[0] + ' ' + this.example[1] + ' ' + this.example[2];
		this.operator = this.example[1];
		let chance = randomRange(0, effects.length);//вероятность определённого эффекта
		this.effect = effects[chance];//[~~(chance / 5)];
		//this.description;//описать эффект
	};
	this.renewExample(operator);
	this.draw = function()
	{
		ctx.beginPath();
		let pat;//паттерн рисунка, который отображается на фоне
		switch (this.operator)//выбор фона для оператора
		{
			case '+': ctx.fillStyle = pat = ctx.createPattern(sPlus, 'repeat'); break;
			case '-': ctx.fillStyle = pat = ctx.createPattern(sMinus, 'repeat'); break;
			case '*': ctx.fillStyle = pat = ctx.createPattern(sMultiply, 'repeat'); break;
			case '/': ctx.fillStyle = pat = ctx.createPattern(sDivide, 'repeat'); break;
		}
		ctx.fillStyle = pat;
		ctx.arc(this.x, this.y, 60, 0, 2 * Math.PI);
		ctx.fill();//рисуем фон
		ctx.fillStyle = 'black';
		ctx.arc(this.x, this.y, 60, 0, 2 * Math.PI);
		ctx.stroke();//рисуем чёрную обводку
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.Baseline = 'middle';
		ctx.font = "24px Consolas";
		ctx.fillText(this.number, this.x, this.y);
		ctx.fillStyle = 'black';
		switch(this.effect)
		{
			case 'shield': ctx.fillText("Щит", this.x, this.y + 70); break;
			case 'extraXP': ctx.fillText("Дополнительный опыт", this.x, this.y + 70); break;
			case ' Damage': ctx.fillText("Добавочный урон", this.x, this.y + 70); break;
			case '+Damage': ctx.fillText("Урон сложения", this.x, this.y + 70); break;
			case '-Damage': ctx.fillText("Урон вычитания", this.x, this.y + 70); break;
			case '*Damage': ctx.fillText("Урон умножения", this.x, this.y + 70); break;
			case '/Damage': ctx.fillText("Урон деления", this.x, this.y + 70); break;
			case 'stun': ctx.fillText("Оглушение врага", this.x, this.y + 70); break;
			case 'weak': ctx.fillText("Ослабление врага", this.x, this.y + 70); break;
			case 'heal': ctx.fillText("Лечение", this.x, this.y + 70); break;
			case ' refresh': ctx.fillText("Обновить примеры", this.x, this.y + 70); break;
			case '+refresh': ctx.fillText("Заполнить сложением", this.x, this.y + 70); break;
			case '-refresh': ctx.fillText("Заполнить вычитанием", this.x, this.y + 70); break;
			case '*refresh': ctx.fillText("Заполнить умножением", this.x, this.y + 70); break;
			case '/refresh': ctx.fillText("Заполнить делением", this.x, this.y + 70); break;
			case 'time': ctx.fillText("Добавочное время", this.x, this.y + 70); break;
			case 'empty': ctx.fillText("Без эффекта", this.x, this.y + 70); break;
		}
		ctx.closePath();
	};
};

let Book = function()
{
	this.sprite = sBook;
	this.x = canvas.width/2;//обладать координатами книги(хотя скорее всего нет), однако создать 4 примера сразу, а потом просто сразу их обновлять
	this.y = canvas.height + 360;
	this.hiddenY = canvas.height + 360;
	this.showedY = canvas.height;
	this.examples = [];
	this.examples.push(new Example(this.x - 135, this.y - 290, '+'));
	this.examples.push(new Example(this.x + 135, this.y - 290, '-'));
	this.examples.push(new Example(this.x - 135, this.y - 130, '*'));
	this.examples.push(new Example(this.x + 135, this.y - 130, '/'));
	this.results = [];
	this.renewWithoutRepeats = function(index, op)
	{//функция, устраняющая повторы решений примеров
		let repeating = false;
		this.examples[index].renewExample(op);
		do
		{
			repeating = false;
			for (let i = 0; i < this.examples.length; i++)
			{
				if (i != index && this.examples[i].result == this.examples[index].result)
					repeating = true;
			}
			if (repeating) this.examples[index].renewExample(op);
		} while (repeating);
	};
	this.renewAll = function()
	{
		this.renewWithoutRepeats(0, '+');
		this.renewWithoutRepeats(1, '-');
		this.renewWithoutRepeats(2, '*');
		this.renewWithoutRepeats(3, '/');
	};

	this.damageEnemy = function()
	{
		let damaged = false;
		for (let i = 0; i < this.examples.length; i++)
		{
			if (Player.number == this.examples[i].result)
			{
				Player.correctAnswers++;
				damaged = true;
				let currentDamage = Player.damage;
				let op = this.examples[i].operator;
				let XP = numberSum(this.examples[i].example[0] + this.examples[i].example[2]);
				XP = (op == '+' || op == '-') ? ~~(XP/10) : ~~(XP/5);
				let eff = this.examples[i].effect;

				switch(eff)
				{
					//присваивание длительных эффектов игроку
					//а также weak и stun для enemy
					case 'shield': Player.statusDuration[eff]++; shieldMakeSound.play(); break;//1 щит на ход
					case 'extraXP': 
					case ' Damage': case '+Damage':
					case '-Damage': case '*Damage':
					case '/Damage':
						Player.statusDuration[eff] = 4; break;//бонусы действуют на 4 примера, считая текущий, если оператор подходит
					case 'time':
						ctrl.timer += 5;
						partSys.addText(canvas.width/2, canvas.height/3 + 50, "+5", "#2ECC71", "#186A3B", 3);
						break;
					case 'weak':
						enemy.statusDuration[eff] = 1; break;
					case 'stun':
						enemy.statusDuration[eff] = 1; stunSound.play(); break;//эффекты, причиняемые врагу
				}
				
				//обновить пример на нужный стандартный оператор
				switch(i)
				{//добавляем в статистику правильное решение
					case 0: this.renewWithoutRepeats(i, '+'); Player.corPlus++; break;
					case 1: this.renewWithoutRepeats(i, '-'); Player.corMinus++; break;
					case 2: this.renewWithoutRepeats(i, '*'); Player.corMultiply++; break;
					case 3: this.renewWithoutRepeats(i, '/'); Player.corDivide++; break;
				}

				if (eff == 'heal')
				{
					healSound.play();
					Player.hp += ~~(Player.maxHP / 4);
					Player.hp = (Player.hp > Player.maxHP) ? Player.maxHP : Player.hp;
				}
				if (Player.statusDuration[' Damage'] > 0)
				{
					currentDamage *= 2;
					Player.statusDuration[' Damage']--;
				}
				if (Player.statusDuration[op + 'Damage'] > 0)
				{
					currentDamage *= 2;
					Player.statusDuration[op + 'Damage']--;
				}
				if (Player.statusDuration['extraXP'] > 0)
				{
					XP *= 4;
					Player.statusDuration['extraXP']--;
				}
				
				//атаковать врага
				Player.xp += XP;
				Player.points += XP;
				if (Player.xp > Player.maxXP) Player.levelUp();
				enemy.hp -= currentDamage;
				enemyDamagedSound.play();
				partSys.addText(enemy.x, enemy.y - enemy.sprite.height, currentDamage, 'red', 'black', 3);
				if (eff == ' refresh')
				{
					this.renewAll();
				}
				else if (eff.substring(1) == 'refresh')//обновить все примеры (refresh)
				{
					for (let i = 0; i < this.examples.length; i++)
					{
						this.renewWithoutRepeats(i, eff[0]);//this.examples[i].renewExample(eff[0]);
					}
				}
				break;
			}
		}
		if (!damaged)
		{
			Player.hp -= Player.damage;
			if (Player. hp > 0) playerDamagedSound.play();
			else deathSound.play();
			Player.mistakes++;
			partSys.addText(Player.x, Player.y - Player.sprite.height, Player.damage, 'purple', 'black', 3);
		}
	};
	//если передвижение будет различаться, то присваивать x/y книжки со своей разницей
	this.show = function()//показ книжки
	{
		if (this.y > this.showedY)
		{
			this.y -= 5;
			for (let i = 0; i < this.examples.length; i++)
			{
				this.examples[i].y -= 5;
			}
		}
	};
	this.hide = function()//сокрытие книжки
	{
		if (this.y < this.hiddenY)
		{
			this.y += 5;
			for (let i = 0; i < this.examples.length; i++)
			{
				this.examples[i].y += 5;
			}
		}
	};
	this.draw = function()//отрисовка книжки
	{//примем за начало координат нижнюю центральную часть
		ctx.beginPath();
		ctx.drawImage(this.sprite, this.x - this.sprite.width/2, this.y - this.sprite.height);
		ctx.closePath();
		for (let i = 0; i < this.examples.length; i++)
		{
			this.examples[i].draw();
		}
	};
};

class Control {
	constructor() {
		this.timer = -1;
		this.turn = 'readyToGo';//'attack'|'defend'|'go'|'readyToGo'|'event'|'dead'
	}
	operate()
	{
		//книга выдвигается при враге и прячется в остальные моменты
		if (enemy.x < canvas.width - 120)
		{
			book.show();
		}
		else
		{
			book.hide();
		}

		if (Player.hp <= 0 && mode != 'menu')//геймовер при смерти игрока
		{
			Player.hp = 0;
			enemy.x = canvas.width + 120;
			mode = 'gameOver';
			this.turn = 'dead';
			this.timer = -1;
		}
		else if (enemy.hp <= 0 && this.turn != 'readyToGo')//готовность к перемещению при смерти врага
		{
			enemy.x = canvas.width + 60;
			Player.points += 50 * Player.level;
			Player.frags++;
			Player.statusDuration['shield'] = 0;
			Player.statusDuration['extraXP'] = 0;
			Player.statusDuration[' Damage'] = 0;
			Player.statusDuration['+Damage'] = 0;
			Player.statusDuration['-Damage'] = 0;
			Player.statusDuration['*Damage'] = 0;
			Player.statusDuration['/Damage'] = 0;
			enemy.statusDuration['stun'] = 0;
			enemy.statusDuration['weak'] = 0;
			this.turn = 'readyToGo';
			this.timer = -1;
		}

		if (this.turn == 'readyToGo' && Player.pressedGo)//создаётся враг и начинается перемещение, сделать выборочно event/враг
		{
			enemy = new Enemy("Враг", 20 + (Player.level-1) * 5, 50 + (Player.level-1) * 25);//Здесь создаётся враг, позже можно сделать выборочно, враг/событие
			book.renewAll();
			Player.pressedGo = false;
			this.turn = 'go';
		}

		if (this.turn == 'go')//персонаж перемещается, и позже переключается на атаку, позже сделать ситуативное переключение event/враг
		{
			if (enemy.x > canvas.width * 2/3)	
			{
				Player.dY += -Math.sin(enemy.x * 3 * Math.PI/180)*0.5;
				enemy.x -= 2;
				walls.move(-2);
			}
			else
			{
				Player.dY = 0;
				enemy.x = canvas.width * 2/3;//на всякий контрольный
				this.turn = 'attack';
				this.timer = Player.timerSize;
			}
		}

		if (this.turn == 'defend')//атака врага со статусными эффектами, с переключением на атаку игрока
		{
			enemy.attack();
			this.turn = 'attack';
			this.timer = Player.timerSize;
		}

		if (this.timer > 0)//таймер идёт
		{
			this.timer -= deltaTime / 1000;//вычитаем количество секунд из таймера в любом случае, кроме паузы
		}

		if (this.timer <= 0)//переход по таймеру на этап атаки врага
		{
			if (this.turn == 'attack' && enemy.hp > 0) 
			{
				this.turn = 'defend';
			}
		}
	}
	draw()//прорисовка всего
	{
		let x = Player.x;
		let y = Player.y;
		walls.draw();//стены

		if (enemy.hp > 0) 
		{
			ctx.beginPath();
			//рисовать врага
			ctx.drawImage(enemy.sprite, enemy.x - enemy.sprite.width / 2, y - enemy.sprite.height);
			if (this.turn == 'attack' || this.turn == 'defend')
			{
				drawBar(enemy.hp, enemy.maxHP, 'red', 'green', enemy.x - 40, y + 5, 80, 20);
				ctx.fillStyle = 'white';
				ctx.textAlign = 'center';
				ctx.fillText(enemy.hp, enemy.x, y + 17);
				ctx.fillText(enemy.name, enemy.x, y - 40 - enemy.sprite.height);
			}
			ctx.closePath();
		}
		
		ctx.beginPath();

		//Игрок
		ctx.drawImage(sPlayer, x - sPlayer.width/2, y - sPlayer.height + Player.dY);//рисовать спрайт на середине X и Y считать за нижнюю точку спрайта
		
		ctx.drawImage(sSplit, 0, canvas.height / 6 + 89);

		//Баффы
		if (Player.statusDuration['shield'] > 0) ctx.drawImage(sShield, x - sPlayer.width/2, y - sPlayer.height);

		if (Player.statusDuration[' Damage'] > 0) ctx.drawImage(sBuffs[0], 5, Player.y + 128);
		if (Player.statusDuration['+Damage'] > 0) ctx.drawImage(sBuffs[1], 5, Player.y + 192);
		if (Player.statusDuration['-Damage'] > 0) ctx.drawImage(sBuffs[2], 5, Player.y + 256);
		if (Player.statusDuration['*Damage'] > 0) ctx.drawImage(sBuffs[3], 5, Player.y + 320);
		if (Player.statusDuration['/Damage'] > 0) ctx.drawImage(sBuffs[4], 5, Player.y + 384);
		if (Player.statusDuration['extraXP'] > 0) ctx.drawImage(sBuffs[5], 5, Player.y + 448);
		if (enemy.statusDuration['stun'] > 0) ctx.drawImage(sBuffs[6], canvas.width - 69, enemy.y + 128);
		if (enemy.statusDuration['weak'] > 0) ctx.drawImage(sBuffs[7], canvas.width - 69, enemy.y + 192);
		
		//интерфейс
		drawNumber(Player, x, y);//рисование числа игрока
		drawArcBar(Player.hp, Player.maxHP, 'red', 'green', 40, 40, 35, 10, -Math.PI*4/3, Math.PI/3);
		
		ctx.textBaseline = 'middle';
		ctx.fillStyle = 'gold';//Двойная обводка слова XP
		ctx.fillText('XP', 15, 90);
		ctx.fillStyle = 'black';
		ctx.strokeText('XP', 15, 90);
		drawVerticalBar(Player.xp, Player.maxXP, 'black', 'gold', 5, 100, 10, 100);//шкала опыта
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText(Player.hp, 40, 40);//количество здоровья
		ctx.fillStyle = 'black';
		if (this.timer >= 0)
		{
			drawBar(this.timer, 20, 'transparent', 'grey', canvas.width/2, canvas.height/3 + 50, -200, 20);
			drawBar(this.timer, 20, 'transparent', 'grey', canvas.width/2, canvas.height/3 + 50, 200, 20);
			ctx.fillStyle = 'black';
			ctx.fillText('таймер:' + Number(~~this.timer), canvas.width/2, canvas.height/3 + 60);//таймер организовать в качестве полоски. Сделать функцию отрисовки полоски
		}
		ctx.closePath();

		//частицы
		partSys.operate();//расчёт и прорисовка текстовых частиц

		ctx.textAlign = 'center';
		if (pause)//пауза
		{
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(sBackground, 0, 0);
			ctx.fillStyle = 'black';
			ctx.fillText('Игра приостановлена. Чтобы снять с паузы нажмите "P".', canvas.width/2, canvas.height/2);
		}
		else if (this.turn == 'readyToGo')
		{
			ctx.fillStyle = 'black';
			ctx.fillText('Для паузы нажмите "P"', canvas.width/2, canvas.height/2);
			ctx.fillText('Чтобы продолжить путешествие, нажмите пробел', canvas.width/2, canvas.height/2+30);
		}

		book.draw();//книжка выше всего(рисуется)!

		if (this.turn == 'dead' && mode == 'gameOver')
		{
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.fillRect(0, canvas.height / 3-50, canvas.width, canvas.height / 3+50);
			ctx.fillStyle = 'white';
			ctx.textAlign = 'left';
			ctx.fillText("Вы погибли в сражении.", canvas.width/3, canvas.height/3 - 30);
			ctx.fillText("Заработано " + Player.points + " очков, " + Player.level + " уровень, побеждено " + Player.frags + " врагов.", 10, canvas.height/3);
			ctx.fillText("Решено примеров: ", 10, canvas.height/3 + 30);
			ctx.fillText("Всего: " + Player.correctAnswers, 10, canvas.height/3 + 60);
			ctx.fillText("+: " + Player.corPlus, 10, canvas.height/3 + 90);
			ctx.fillText("-: " + Player.corMinus, 10, canvas.height/3 + 120);
			ctx.fillText("*: " + Player.corMultiply, 10, canvas.height/3 + 150);
			ctx.fillText("/: " + Player.corDivide, 10, canvas.height/3 + 180);
			ctx.fillText("Ошибок: " + Player.mistakes + ' Чтобы выйти в меню нажмите "0"', 10, canvas.height/3 + 210);
			ctx.closePath();
		}

		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		if (mode == 'menu')
		{
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(sBackground, 0, 0);
			ctx.fillStyle = "black";
			ctx.fillText("1. Начать простую игру.", canvas.width/2, canvas.height / 3);
			ctx.fillText("2. Начать нормальную игру.", canvas.width/2, canvas.height / 3 + 30);
			ctx.fillText("3. Начать сложную игру.", canvas.width/2, canvas.height / 3 + 60);
			ctx.fillText("4. Как играть.", canvas.width/2, canvas.height / 3 + 90);
		}
		else if (mode == 'howToPlay')
		{
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(sBackground, 0, 0);
			ctx.textAlign = 'left';
			ctx.fillStyle = "black";
			ctx.fillText("Чтобы продолжить путешествие и встретиться с новым врагом,", 5, canvas.height/3);
			ctx.fillText("нажмите пробел.", 0, canvas.height/3 + 30);
			ctx.fillText("Решайте примеры, чтобы побеждать врагов. Под примерами", 5, canvas.height/3 + 60);
			ctx.fillText("указаны разные эффекты, влияющие на игрока, врага и", 5, canvas.height/3 + 90);
			ctx.fillText("состав примеров в книге заклинаний. За каждое решение", 5, canvas.height/3 + 120);
			ctx.fillText("игроку прибавляется опыт. Новый уровень игрока влияет на", 5, canvas.height/3 + 150);
			ctx.fillText("пределы генерации чисел, здоровье и силу игрока. Враг", 5, canvas.height/3 + 180);
			ctx.fillText("также становится сильнее.", 5, canvas.height/3 + 210);
			ctx.fillText("1. Вернуться обратно.", 5, canvas.height - 30);
		}
	}
}

let ParticleSystem = function()
{
	this.particles = [];
	this.addText = function(x, y, str, color, bgrcolor, timer)
	{
		this.particles.push(new textParticle(x, y, str, color, bgrcolor, timer));
	};
	this.addSprite = function(x, y, img, xSpeed, ySpeed, timer)
	{
		this.particles.push(new spriteParticle(x, y, img, xSpeed, ySpeed, timer));
	};
	this.operate = function()
	{
		for (let i = 0; i < this.particles.length; i++)
		{
			this.particles[i].operate();
			if (this.particles[i].timer <= 0)
			{
				this.particles.splice(i);
				i--;
			}
		}
	};
};
let textParticle = function(x, y, str, color, bgrcolor, timer)
{
	this.x = x;
	this.y = y;
	this.str = str;
	this.color = color;
	this.timer = timer;
	this.operate = function()
	{
		let fll = ctx.fillStyle;
		let strk = ctx.strokeStyle;
		ctx.fillStyle = color;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'center';
		ctx.fillText(str, this.x, this.y);
		ctx.strokeStyle = bgrcolor;
		ctx.strokeText(str, this.x, this.y)
		this.y--;
		this.timer -= deltaTime / 1000;
		ctx.fillStyle = fll;
		ctx.strokeStyle = strk;
	};
};
let spriteParticle = function(x, y, img, xSpeed, ySpeed, timer)
{
	this.x = x;
	this.y = y;
	this.sprite = img;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;
	this.timer = timer;
	this.operate = function()
	{
		ctx.drawImage(this.sprite, this.x, this.y);
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		this.timer -= deltaTime / 1000;
	};
};


let Background = function()
{
	this.walls = [];
	this.lastWallID = 0;
	for (let i = 0; i < canvas.width+48; i += 48)//48 - ширина спрайта. Изначальный запрос sprite.width может выдать ошибку из-за непрогрузки спрайта
	{
		this.walls.push(new Wall(i, 0));
		this.lastWallID = i/48;
	}
	this.move = function(x)
	{
		for (let i = 0; i < this.walls.length; i++)
		{
			this.walls[i].move(x);
			if(this.walls[i].x <= -48)
			{
				this.walls[i].x = this.walls[this.lastWallID].x+48;
				this.lastWallID = i;
			}
		}
		
	};
	this.draw = function()
	{
		for (let i = 0; i < this.walls.length; i++)
		{
			this.walls[i].draw();
		}
	};
};
let Wall = function(x, y)
{
	this.x = x;
	this.y = y;
	this.image = sWall;
	this.move = function(x)
	{
		this.x += x;
	};
	this.draw = function()
	{
		ctx.drawImage(this.image, this.x, this.y);
	};

};