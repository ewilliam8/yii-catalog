<?php

namespace app\models;
use yii\base\Model;

class TestForm extends Model{

    public $name;
    public $email;
    public $text;

    public function attributelabels() {
        return [
            'name' => 'Имя',
            'email' => 'E-mail',
            'text' => 'Текст сообщения',
        ];
    }

    public function rules() {
        return [
            [ [ 'name', 'email' ], 'required', 'message' => 'Поле обязательно' ],
            [ 'text', 'trim' ]
        ];
    }
}