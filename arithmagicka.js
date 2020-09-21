let canvas = document.getElementById("canvas");
canvas.height = 700;//window.innerHeight;
canvas.width = 800;//window.innerWidth;


let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let sPlayer = new Image();
sPlayer.src = "images\\player.png";
let sEnemy = new Image();
sEnemy.src = "images\\enemy.png";
let sBook = new Image();
sBook.src = "images\\book.png";
let sShield = new Image();
sShield.src = "images\\shield.png";
let sShieldParts = [];
for (let i = 0; i < 5; i++)
{
	sShieldParts[i] = new Image();
	sShieldParts[i].src = "images\\shieldPart" + i + ".png";
}
let sWall = new Image();
sWall.src = "images\\wall0.png";
let sSplit = new Image();
sSplit.src = "images\\split.png";
//Спрайты бафов
let sBuffs = [];
for (let i = 0; i < 8; i++)
	sBuffs[i] = new Image();
sBuffs[0].src = "images\\Buff.png";
sBuffs[1].src = "images\\plusBuff.png";
sBuffs[2].src = "images\\minusBuff.png";
sBuffs[3].src = "images\\multiplyBuff.png";
sBuffs[4].src = "images\\divideBuff.png";
sBuffs[5].src = "images\\xpBuff.png";
sBuffs[6].src = "images\\stunBuff.png";
sBuffs[7].src = "images\\weakBuff.png";


//Спрайты для фона
let sPlus = new Image();
sPlus.src = "images\\plus.png";
let sMinus = new Image();
sMinus.src = "images\\minus.png";
let sMultiply = new Image();
sMultiply.src = "images\\multiply.png";
let sDivide = new Image();
sDivide.src = "images\\divide.png";
let sBackground = new Image();
sBackground.src = "images\\background.png";

//Аудио
let deathSound = new Audio("sounds\\death.wav");
let levelUpSound = new Audio("sounds\\levelUp.wav");
let playerDamagedSound = new Audio("sounds\\playerDamaged.wav");
let enemyDamagedSound = new Audio("sounds\\enemyDamaged.wav");
let shieldBreakSound = new Audio("sounds\\shieldBreak.wav");
let shieldMakeSound = new Audio("sounds\\shieldMake.wav");
let healSound = new Audio("sounds\\heal.wav");
let stunSound = new Audio("sounds\\stun.wav");

let mode = 'menu';//menu, game, gameOver, м.б. settings
let pause = false;
let ctrl = new Control();
let partSys = new ParticleSystem();
let deltaTime = performance.now();
let prevTime = performance.now();

//СТАРТОВЫЕ ОГРАНИЧЕНИЯ НА ПРИМЕРЫ
let plusMinusLimit = 80;
let multipleLimit = 6;
let divideLimit = 40;
//примеры будут брать эффекты из данного массива
//необходимо поправить вероятности
let effects = ['shield', 'extraXP', ' Damage', '+Damage', '-Damage', 
			   '*Damage', '/Damage', 'stun', 'weak', 'heal', 'heal',
			   ' refresh', '+refresh', '-refresh', '*refresh', '/refresh', 'time',
			   'empty', 'empty', 'empty', 'empty', 'empty'];

let walls = new Background();
let enemy = new Enemy("Враг", 20, 50);
let Player = new PlayerInstance();
let book = new Book();//книга спрятана, должна появляться в центре

let num = [];//нажата ли клавиша цифры или нет
for (let i = 0; i < 20; i++)
{
	num[i] = {};
	num[i].active = true;//клавиша активна
	num[i].justPressed = false;//только нажата(должна быть активна только 1 кадр)(всё это обрабатывается в key(Down/Up)Handler)
}
//num[10].value = 8;//backspace
//num[11].value = 13;//enter
//num[11].value = 80;//P(pause)

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e)//Обработчики событий клавиатуры и мыши
{
	//контроль нажатия цифр и других клавиш
	for (let i = 0; i < 10; i++)
	{
		if (((e.keyCode == 48 + i) || (e.keyCode == 96 + i)) && num[i].active)
		{
			num[i].justPressed = true;
		}
	}
	switch (e.keyCode)//для других клавиш
	{
	case 8://backspace
		if (num[10].active)
			num[10].justPressed = true; break;
	case 13://enter
		if (num[11].active)
			num[11].justPressed = true; break;
	case 80://буква P(английская)
		if (num[12].active)
			num[12].justPressed = true; break;
	case 32://пробел
		if (num[13].active && ctrl.turn == 'readyToGo')
			num[13].justPressed = true; break;
	}

	for (let i = 0; i < 10; i++)//действия клавиш цифр
	{
		if (num[i].justPressed && num[i].active)
		{
			num[i].justPressed = false;
			num[i].active = false;
			if (mode == 'gameOver' && ctrl.turn == 'dead' && i == 0)
			{
				ctrl.turn = 'readyToGo';
				mode = 'menu';
				Player.hp = 1;
			}
			if (mode == 'game' && ctrl.turn == 'attack' && Player.number < 1000000) Player.number = Player.number * 10 + Number(i);
			
			if (mode == 'menu')
			{
				switch(i)
				{
				case 1:
					plusMinusLimit = 80;
					multipleLimit = 6;
					divideLimit = 40;
					Player = new PlayerInstance();
					enemy = new Enemy("Враг", 20, 50);
					ctrl = new Control();
					mode = 'game';
					break;
				case 2:
					plusMinusLimit = 80;
					multipleLimit = 6;
					divideLimit = 40;
					Player = new PlayerInstance();
					enemy = new Enemy("Враг", 20, 50);
					ctrl = new Control();
					Player.xp = 51150;
					while (Player.xp >= Player.maxXP)
					{
						Player.levelUp();
					}
					mode = 'game';
					break;
				case 3:
					
					plusMinusLimit = 80;
					multipleLimit = 6;
					divideLimit = 40;
					Player = new PlayerInstance();
					enemy = new Enemy("Враг", 20, 50);
					ctrl = new Control();
					Player.xp = 52428750;
					while (Player.xp >= Player.maxXP)
					{
						Player.levelUp();
					}
					mode = 'game';
					break;
				case 4:
					mode = 'howToPlay'; break;
				}
			}
			if (mode == 'howToPlay' && i == 1)
				mode = 'menu';
		}
	}

	if (mode == 'game')
	{
		switch (e.keyCode)//действия других клавиш
		{
		case 8: //backspace
			if (num[10].justPressed && num[10].active)
			{
				Player.number = ~~(Player.number / 10);//деление на 10 и удаление остатка
				num[10].justPressed = false;
				num[10].active = false;
			} break;
		case 13: //enter
			if (Player.number != 0)
			{
				//добавить сюда исполнение всех эффектов игрока
				if (ctrl.turn == 'attack') book.damageEnemy();
			}
			Player.number = 0;
			break;
		case 80: //letter P
			if (ctrl.turn == 'readyToGo')
			{
				pause = !pause;
			} break;
		case 32:
			{
				if ((!pause) && (ctrl.turn == 'readyToGo')) Player.pressedGo = true;
			} break;
		}
	}
}

function keyUpHandler(e)//обратная активация отжатых клавиш
{
	for (let i = 0; i < 10; i++)
	{
		if ((e.keyCode == 48 + i) || (e.keyCode == 96 + i))
		{
			num[i].active = true;
			num[i].justPressed = false;
		}
	}
	for (let i = 10; i < 20; i++)
	{
		num[i].active = true;
		num[i].justPressed = false;
	}
}


function draw()
{
	deltaTiming();//обновляем deltaTime для использования передвижения, а также таймеров
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctrl.draw();
	if (!pause) ctrl.operate();

	requestAnimationFrame(draw);
}
draw();