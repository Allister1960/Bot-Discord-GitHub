const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

// ===================== 🌸 KONSTANTA UTAMA =====================
const BOT_INFO = {
  NAME: 'Heizou The Helper',
  VERSION: '🌸 Sakura Edition v1.2',
};

const FLAGS = {
  EPHEMERAL: 64
};

const CONFIG = {
  CHANNELS: {
    STATUS: '1352852214523367526',
    TIKTOK: '1337354684737781812',
    GIVEAWAY: '1328706479360053371',
    SUGGESTIONS: '1345065170933911653',
    TRANSACTIONS: '1328716883884769374'
  },
  
  USERS: {
    ATUN: '1311148461709725761',
    MAHESA: '1262567474889490524',
    RENREN: '1005415465130139700'
  },
  
  ROLES: {
    STAFF: '1328286509752647702',
    TRADER: '1328361695105519710'
  },
  
  LINKS: {
    SOCIABUZZ: {
      ATUN: 'https://sociabuzz.com/atun',
      RENREN: 'https://sociabuzz.com/allister1960'
    },
    TIKTOK_RENREN: 'https://www.tiktok.com/@ayniman4',
    TIKTOK_SUKINANEKO: 'https://www.tiktok.com/@sukinaneko',
    GITHUB: 'https://github.com/Allister1960/Bot-Discord-GitHub',
    SUPPORT: 'https://discord.gg/your-invite'
  },
  
  DESIGN: {
    COLORS: {
      PRIMARY: '#FF9F9F',
      SECONDARY: '#A8E6CF',
      ERROR: '#FF6961',
      INFO: '#BAE1FF'
    },
    IMAGES: {
      BANNER: './images/heizou_banner.png',
      ICON: './images/heizou_icon.png',
      TIKTOK_ICON: './images/tiktok_icon.png',
      ERROR_ICON: './images/error_icon.png',
      GIFT_ICON: './images/gift_icon.png'
    },
    EMOJI: {
      ADMIN: '🌸',
      LINK: '🔗',
      BUG: '🐞'
    }
  },

  MESSAGES: {
    WELCOME: `${BOT_INFO.NAME} siap membantu!`,
    HELP: [
      '🌸 /admin - Info admin server',
      '📮 /sociabuzz - Link donasi admin',
      '🔗 /invitelink - Buat invite link',
      '🎥 /tiktok - Info TikTok admin',
      '🐞 /bug - Lapor bug/error',
      '💤 /afk - Set status AFK',
      '🎉 /giveaway - Memulai Giveaway (Staff)',
      '📝 /check - Check durasi nyala Bot',
      '⚠️ /shutdown - Matikan bot (Owner)',
      '🤖 /vbot - Info tentang bot',
      '📌 /status - Update status (Staff)'
    ]
  },
  
  BOT: BOT_INFO
};

// ===================== ⚡ DAFTAR SLASH COMMAND =====================
const commands = [
  {
    name: 'help',
    description: 'Dapatkan menu bantuan privat'
  },
  {
    name: 'admin',
    description: 'Lihat info admin server'
  },
  {
    name: 'tiktok',
    description: 'Info akun TikTok admin'
  },
  {
    name: 'afk',
    description: 'Set status AFK',
    options: [{
      name: 'reason',
      type: 3,
      description: 'Alasan AFK',
      required: false
    }]
  },
  {
    name: 'invitelink',
    description: 'Buat invite link server'
  },
  {
    name: 'vbot',
    description: 'Info versi bot'
  },
  {
    name: 'status',
    description: 'Ubah status (Staff only)',
    options: [{
      name: 'status',
      type: 3,
      description: 'Status baru',
      required: true
    }]
  },
  {
    name: 'sociabuzz',
    description: 'Link donasi Sociabuzz admin'
  },
  {
    name: 'giveaway',
    description: 'Mulai giveaway (Staff only)',
    options: [
      {
        name: 'prize',
        type: 3,
        description: 'Hadiah giveaway',
        required: true
      },
      {
        name: 'duration',
        type: 3,
        description: 'Durasi (contoh: 24h)',
        required: true
      }
    ]
  },
  {
    name: 'check',
    description: 'Cek durasi aktif bot'
  },
  {
    name: 'shutdown',
    description: 'Matikan bot (Owner only)'
  },
  {
    name: 'bug',
    description: 'Laporkan bug ke developer',
    options: [{
      name: 'description',
      type: 3,
      description: 'Deskripsi bug',
      required: true
    }]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// ===================== 🛠️ SISTEM DATA =====================
let afkUsers = {};
let adminStatus = {
  [CONFIG.USERS.RENREN]: { status: '🟡 Ngoding', role: 'Admin & Owner Server' },
  [CONFIG.USERS.ATUN]: { status: '⚫ Belum Setting', role: 'Admin Blox Fruit' },
  [CONFIG.USERS.MAHESA]: { status: '🔴 HP rusak', role: 'Admin TikTok' }
};

// ===================== 🎀 INISIALISASI CLIENT =====================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ===================== 🛠️ FUNGSI UTILITY =====================
const createHeizouEmbed = (title, description, color = CONFIG.DESIGN.COLORS.PRIMARY) => {
  const divider = '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯▬▬▬▬▬▬';
  return new EmbedBuilder()
    .setTitle(`${CONFIG.DESIGN.EMOJI.ADMIN} ${title}`)
    .setDescription(`${divider}\n${description}\n${divider}`)
    .setColor(color)
    .setFooter({ 
      text: `${CONFIG.BOT.NAME} • ${CONFIG.BOT.VERSION}`,
      iconURL: 'attachment://heizou_icon.png'
    })
    .setTimestamp();
};

// ===================== ⚙️ EVENT HANDLERS =====================
client.once('ready', async () => {
  console.log(`${CONFIG.BOT.NAME} Aktif!\nCredit: Suki na Neko's Team\nMain Developer: Renren`);
  
  try {

// ===================== ⚡ SLASH COMMAND REGISTRATION =====================
const registerCommands = async () => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log(`🔗 Slash commands terdaftar (${commands.length} command)`);
    } catch (error) {
      console.error('❌ Gagal registrasi command:', error.message);
    }
  };
  registerCommands();

    // Send status message
    const iconAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ICON);
    const bannerAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.BANNER);
    const channel = client.channels.cache.get(CONFIG.CHANNELS.STATUS);
    
    if (channel) {
      await channel.send({
        embeds: [createHeizouEmbed(
          'Halo👋! Bot Aktif untuk membantu 🟢',
          CONFIG.MESSAGES.WELCOME,
          CONFIG.DESIGN.COLORS.SECONDARY
        ).setThumbnail('attachment://heizou_icon.png').setImage('attachment://heizou_banner.png')],
        files: [iconAttachment, bannerAttachment]
      });
    }
  } catch (error) {
    console.error('Error during startup:', error);
  }
});

// ===================== 🎮 HANDLER SLASH COMMANDS =====================
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  // Dismiss Button Component
  const dismissButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('dismiss')
      .setLabel('Tutup Pesan')
      .setStyle(ButtonStyle.Secondary)
  );

  try {
    switch(interaction.commandName) {
      case 'help': {
        const helpMessage = `Halo <@${interaction.user.id}>! Jika ada pertanyaan, DM Admin <@${CONFIG.USERS.RENREN}>.\n\n${CONFIG.MESSAGES.HELP.join('\n')}`;
        
        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          embeds: [
            createHeizouEmbed(
              'Menu Bantuan Privat 🌸',
              helpMessage,
              CONFIG.DESIGN.COLORS.SECONDARY
            )
          ],
          components: [dismissButton]
        });
        break;
      }

      case 'admin': {
        const adminFields = Object.values(CONFIG.USERS)
          .filter(userId => adminStatus[userId])
          .map(userId => ({
            name: `${adminStatus[userId].status}`,
            value: `${CONFIG.DESIGN.EMOJI.ADMIN} <@${userId}>\n**Jabatan:** ${adminStatus[userId].role}`,
            inline: true
          }));

        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          embeds: [
            createHeizouEmbed(
              '🌸 Tim Administrator',
              'Daftar admin dan status terkini:',
              CONFIG.DESIGN.COLORS.PRIMARY
            ).addFields(adminFields)
          ],
          components: [dismissButton]
        });
        break;
      }

      case 'tiktok': {
        const tiktokIcon = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.TIKTOK_ICON);
        
        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          files: [tiktokIcon],
          embeds: [
            createHeizouEmbed(
              '📱 TikTok Resmi',
              `**Daftar akun TikTok admin**:\n` +
              `${CONFIG.DESIGN.EMOJI.LINK} **Renren**: [@ayniman4](${CONFIG.LINKS.TIKTOK_RENREN})\n` +
              `${CONFIG.DESIGN.EMOJI.LINK} **Suki na Neko**: [@sukinaneko](${CONFIG.LINKS.TIKTOK_SUKINANEKO})`,
              CONFIG.DESIGN.COLORS.SECONDARY
            ).setThumbnail('attachment://tiktok_icon.png')
          ],
          components: [dismissButton]
        });
        break;
      }

      case 'afk': {
        const reason = interaction.options.getString('reason') || 'Sedang AFK';
        const member = interaction.member;
        
        afkUsers[interaction.user.id] = {
          timestamp: Date.now(),
          reason: reason,
          originalNickname: member.nickname || member.user.username
        };

        try {
          await member.setNickname(`[AFK] ${member.nickname || member.user.username}`);
        } catch (error) {
          console.error('Failed to set nickname:', error);
        }

        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          embeds: [
            createHeizouEmbed(
              'Status AFK Diaktifkan! 💤',
              `Alasan: \`${reason}\`\nKetik pesan apa pun untuk menonaktifkan AFK`,
              CONFIG.DESIGN.COLORS.SECONDARY
            )
          ],
          components: [dismissButton]
        });
        break;
      }

      case 'invitelink': {
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has('CREATE_INSTANT_INVITE')) {
          return interaction.reply({
    flags: FLAGS.EPHEMERAL,
            content: '❌ Bot tidak punya izin buat invite link!',
            components: [dismissButton]
          });
        }

        const invite = await interaction.channel.createInvite({
          maxAge: 86400,
          maxUses: 1,
          temporary: true
        });

        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          embeds: [
            createHeizouEmbed(
              '🔗 Link Undangan 24 Jam',
              `**Link:** ${invite.url}\nSalin: \`${invite.url}\``,
              CONFIG.DESIGN.COLORS.SECONDARY
            )
          ],
          components: [dismissButton]
        });
        break;
      }

      case 'vbot': {
        const iconAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ICON);
        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          files: [iconAttachment],
          embeds: [
            createHeizouEmbed(
              '🤖 Informasi Bot',
              `**Versi:** ${CONFIG.BOT.VERSION}\n**Developer:** <@${CONFIG.USERS.RENREN}>`,
              CONFIG.DESIGN.COLORS.INFO
            ).setThumbnail('attachment://heizou_icon.png')
          ],
          components: [dismissButton]
        });
        break;
      }

      case 'status': {
        if (!interaction.member.roles.cache.has(CONFIG.ROLES.STAFF)) {
          return interaction.reply({
    flags: FLAGS.EPHEMERAL,
            content: '❌ Hanya staff yang bisa ubah status!',
            components: [dismissButton]
          });
        }

        const newStatus = interaction.options.getString('status');
        adminStatus[interaction.user.id] = {
          ...adminStatus[interaction.user.id],
          status: newStatus
        };

        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          embeds: [
            createHeizouEmbed(
              'Status Diperbarui!',
              `Status baru: \`${newStatus}\``,
              CONFIG.DESIGN.COLORS.SECONDARY
            )
          ],
          components: [dismissButton]
        });
        break;
      }

      case 'sociabuzz': {
        const iconAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ICON);
        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          files: [iconAttachment],
          embeds: [
            createHeizouEmbed(
              '💌 Sociabuzz Admin',
              `Dukung admin via:\n\n` +
              `• [Atun](${CONFIG.LINKS.SOCIABUZZ.ATUN})\n` +
              `• [Renren](${CONFIG.LINKS.SOCIABUZZ.RENREN})`,
              CONFIG.DESIGN.COLORS.PRIMARY
            ).setThumbnail('attachment://heizou_icon.png')
          ],
          components: [dismissButton]
        });
        break;
      }

      case 'giveaway': {
        if (!interaction.member.roles.cache.has(CONFIG.ROLES.STAFF)) {
          return interaction.reply({
    flags: FLAGS.EPHEMERAL,
            content: '❌ Hanya staff yang bisa buat giveaway!',
            components: [dismissButton]
          });
        }

        const prize = interaction.options.getString('prize');
        const duration = interaction.options.getString('duration');
        const giftIcon = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.GIFT_ICON);

        const giveawayEmbed = createHeizouEmbed(
          '🎉 GIVEAWAY 🎉',
          `**Hadiah:** ${prize}\n**Durasi:** ${duration}`,
          CONFIG.DESIGN.COLORS.SECONDARY
        ).setImage('attachment://gift_icon.png');

        const channel = client.channels.cache.get(CONFIG.CHANNELS.GIVEAWAY);
        const msg = await channel.send({
          content: '@everyone',
          embeds: [giveawayEmbed],
          files: [giftIcon]
        });
        await msg.react('🎁');

        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          content: `✅ Giveaway dibuat di ${channel}`,
          components: [dismissButton]
        });
        break;
      }

      case 'check': {
        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          content: `⏱️ Bot aktif selama: ${Math.floor(process.uptime())} detik`,
          components: [dismissButton]
        });
        break;
      }

      case 'shutdown': {
        if (interaction.user.id !== CONFIG.USERS.RENREN) {
          return interaction.reply({
    flags: FLAGS.EPHEMERAL,
            content: '❌ Hanya owner yang bisa matikan bot!',
            components: [dismissButton]
          });
        }

        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          content: '🛑 Mematikan bot dalam 3 detik...',
          components: [dismissButton]
        });

        setTimeout(() => {
          client.destroy();
          process.exit(0);
        }, 3000);
        break;
      }

      case 'bug': {
        const description = interaction.options.getString('description');
        const developer = await client.users.fetch(CONFIG.USERS.RENREN);
        
        await developer.send({
          embeds: [
            createHeizouEmbed(
              '🐞 Laporan Bug Baru',
              `**Pelapor:** <@${interaction.user.id}>\n` +
              `**Server:** ${interaction.guild.name}\n` +
              `**Deskripsi:**\n\`\`\`${description}\`\`\``,
              CONFIG.DESIGN.COLORS.ERROR
            )
          ]
        });

        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          embeds: [
            createHeizouEmbed(
              'Laporan Terkirim!',
              `Bug telah dilaporkan ke developer`,
              CONFIG.DESIGN.COLORS.SECONDARY
            )
          ],
          components: [dismissButton]
        });
        break;
      }

      default:
        await interaction.reply({
  flags: FLAGS.EPHEMERAL,
          content: 'Command tidak dikenali! Ketik /help untuk melihat daftar command.',
          components: [dismissButton]
        });
    }
  } catch (error) {
    console.error(`Error handling /${interaction.commandName}:`, error);
    await interaction.reply({
      ephemeral: true,
      content: '❌ Terjadi kesalahan sistem saat memproses command!',
      components: [dismissButton]
    });
  }
});

// ===================== 🗑️ HANDLER TOMBOL DISMISS =====================
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  
  if (interaction.customId === 'dismiss') {
    await interaction.update({
      content: "Pesan ditutup ✅",
      embeds: [],
      components: []
    });
  }
});

// ===================== 📩 HANDLER PREFIX COMMANDS (!help, dll) =====================
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

// Fungsi optimasi untuk auto-delete
const autoDelete = async (msg, content, options = {}) => {
    try {
      const reply = await msg.reply(content, options);
      setTimeout(async () => {
        try {
          await reply.delete();
          await msg.delete(); // Hapus juga pesan trigger command
        } catch (error) {
          if (![10008, 50003].includes(error.code)) { // Abaikan error "Unknown Message" atau "Missing Access"
            console.error('[Auto-Delete Error]', error.message); // Hanya log error penting
          }
        }
      }, 30000);
      return reply;
    } catch (error) {
      console.error('[Reply Error]', error.message); // Log singkat
    }
  };

  try {
    switch(command) {
      case 'help': {
        const iconAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ICON);
        const helpMessage = `Halo <@${message.author.id}>! ini menunya. Jika ada yang ingin ditanya DM Admin <@${CONFIG.USERS.RENREN}>`;
        
        const reply = await message.reply({
          files: [iconAttachment],
          embeds: [
            createHeizouEmbed(
              'Menu Bantuan Lengkap',
              `${helpMessage}\n\n${CONFIG.MESSAGES.HELP.join('\n').replaceAll('/', '!')}`,
              CONFIG.DESIGN.COLORS.SECONDARY
            ).setThumbnail('attachment://heizou_icon.png')
          ]
        });

        // Auto-delete after 30 seconds
        setTimeout(() => reply.delete().catch(console.error), 30000);
        break;
      }

      // ... (Tambahkan handler untuk prefix command lainnya)

      default:
        const reply = await message.reply({
          embeds: [
            createHeizouEmbed(
              'Command Tidak Dikenal',
              'Gunakan !help untuk melihat menu bantuan',
              CONFIG.DESIGN.COLORS.ERROR
            )
          ]
        });
        setTimeout(() => reply.delete().catch(console.error), 3000);
    }
  } catch (error) {
    console.error('Error handling prefix command:', error);
  }
});

client.login(process.env.TOKEN);